// Filesystem
const fs = require('fs'),
  filePath = require('path');

// Gulp modules
const {src, dest, watch} = require('gulp');

// Common plugins
const gulpIf = require('gulp-if'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  cache = require('gulp-cache'),
  merge = require('merge-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  debug = require('gulp-debug');

// HTML plugins
const pug = require('gulp-pug'),
    prettify = require('gulp-prettify');

// Server plugins
const browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  GulpSsh = require('gulp-ssh');

// JS plugins
const bro = require('gulp-bro'),
  babelify = require('babelify'),
  uglify = require('gulp-uglify');

const include = require('gulp-include');

// Styles plugins
const sass = require('gulp-dart-sass'),
  cssMin = require('gulp-cssnano'),
  postcss = require('gulp-postcss'),
  autoprefix = require('autoprefixer');

// Configurations
const isSftp = process.argv.includes('--deploy');
const sshConfig = JSON.parse(fs.readFileSync(filePath.resolve(__dirname, '.sftpconfig'), 'utf8'));
const path = {
  remote: sshConfig.path,
  src: {
    styles: {
      scss: 'src/scss/app.scss'
    },
    js: {
      app: 'src/js/app.js',
    },
    html: 'src/pug/pages/**/*.pug'
  },
  vendor: {
    css: 'src/vendor/css/*.css',
    js: 'src/vendor/js/*.js'
  },
  watch: {
    styles: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    html: 'src/pug/**/*.pug'
  },
  dest: {
    html: 'public/',
    js: 'public/assets/js',
    scss: 'public/assets/css',
  }
};

// Creates SSH connection
const ssh = new GulpSsh({
  ignoreErrors: true,
  sshConfig: sshConfig.connect
});

// Assembles styles
const styles = () => {
  let tasks = Object.keys(path.src.styles).map(type => {
    let stream = src(path.src.styles[type])
      .pipe(sourcemaps.init())
      .pipe(gulpIf(type === 'scss', sass({sourcemap: true, includePaths: [__dirname + '/node_modules']}).on('error', sass.logError)))
      .pipe(postcss([autoprefix({overrideBrowserslist: ['last 10 versions']})]))
      .pipe(cssMin())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('./'))
      .pipe(dest(path.dest[type]));

    return isSftp ? stream.pipe(ssh.dest(path.remote + path.dest[type])) : stream;
  });

  return merge(tasks);
};

// Assembles js bundle
const js = () => {
  let tasks = Object.keys(path.src.js).map(type => {
    let stream = src(path.src.js[type])
      .pipe(sourcemaps.init())
      .pipe(bro({
        transform: [
          babelify.configure({presets: ['@babel/env']})
        ]
      }))
      .pipe(uglify({
        output: {comments: true}
      }))
      .pipe(include({
        includePaths: [__dirname + '/node_modules']
      }))
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('./'))
      .pipe(dest(path.dest.js));

    return isSftp ? stream.pipe(ssh.dest(path.remote + path.dest.js)) : stream;
  });

  return merge(tasks);
};

// Assembles HTML
const html = () => {
  let stream = src(path.src.html)
      .pipe(debug())
      .pipe(pug())
      .pipe(prettify({
        indent_size: 2
      }))
      .pipe(dest(path.dest.html));

  return isSftp ? stream.pipe(ssh.dest(path.remote + path.dest.html)) : stream;
};

// Assembles external plugins styles and js
const vendor = () => {
  let tasks = Object.keys(path.vendor).map(type => {
    let stream = src(path.vendor[type])
      .pipe(debug())
      .pipe(sourcemaps.init())
      .pipe(concat('plugins.min.' + type))
      .pipe(gulpIf(type === 'css', cssMin(), uglify()))
      .pipe(sourcemaps.write('./'))
      .pipe(dest(path.dest[type]));

    return isSftp ? stream.pipe(ssh.dest(path.remote + path.dest[type])) : stream;
  });

  return merge(tasks);
};

// Runs local server
function server() {
  browserSync.init({
    server: path.dest.html,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watcher();
}

// Gulp watch task
function watcher() {
  watch(path.watch.js, js).on('change', reload);
  watch(path.watch.styles, styles).on('change', reload);
  watch(path.watch.html, html).on('change', reload);
}

exports.js = js;
exports.styles = styles;
exports.html = html;
exports.server = server;
//exports.build = parallel(series(lintPug, html), series(lintStyles, styles('')), js, image, parallel(vendor('css'), vendor('js'));
exports.default = watcher;
