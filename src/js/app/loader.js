//pseudocode
document.addEventListener('step:show', () => {

    let loader = document.querySelector('.loader.show');

    if (loader) {
        setTimeout(() => {
            loader.classList.add('success');
        }, 2000);
    }
});