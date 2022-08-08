import { isMobileDevice, scrollbarVisible } from '../modules/global-functions';

let checkScrollable = () => {
    let scrollElem = document.querySelector('.converter__body');

    if (scrollElem) {
        scrollElem.classList[scrollbarVisible(scrollElem) ? 'add' : 'remove']('scrollable');
    }
};

if (!isMobileDevice) {
    document.addEventListener('DOMContentLoaded', checkScrollable);
    window.addEventListener('resize', checkScrollable);
}