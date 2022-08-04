//pseudocode
let loader = document.querySelector('.loader');

if (loader) {
    setTimeout(() => {
        loader.classList.add('success');
    }, 2000);
}