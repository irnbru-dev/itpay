const fs = require('fs');

const createDirs = () => {
    fs.mkdir('src', () => {
        fs.mkdir('src/js', () => {
            fs.mkdirSync('src/js/app');
            fs.mkdirSync('src/js/vendor');
            fs.openSync('src/js/app.js', 'w');
        });

        fs.mkdir('src/scss', () => {
            fs.mkdirSync('src/scss/blocks');
            fs.mkdirSync('src/scss/global');
            fs.mkdirSync('src/scss/vendor');
            fs.openSync('src/scss/style.scss', 'w');
            fs.openSync('src/scss/global/_fonts.scss', 'w');
            fs.openSync('src/scss/global/_global.scss', 'w');
            fs.openSync('src/scss/global/_typography.scss', 'w');
            fs.openSync('src/scss/global/_variables.scss', 'w');
        });

        fs.mkdir('src/pug', () => {
            fs.mkdirSync('src/pug/blocks');
            fs.mkdirSync('src/pug/inc');
            fs.openSync('src/pug/inc/_head.pug', 'w');
            fs.openSync('src/pug/inc/_mixins.pug', 'w');
            fs.openSync('src/pug/blocks/header.pug', 'w');
            fs.openSync('src/pug/blocks/footer.pug', 'w');
            fs.openSync('src/pug/index.pug', 'w');
        });

        fs.mkdirSync('src/img');
    });

    fs.mkdir('assets', () => {
        fs.mkdirSync('assets/js');
        fs.mkdirSync('assets/css');
        fs.mkdirSync('assets/img');
        fs.mkdirSync('assets/fonts');
    });
};

createDirs();
