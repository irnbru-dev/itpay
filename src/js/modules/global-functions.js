const isMobileDevice = () => typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;

const scrollbarVisible = (element) => {
    return element.scrollHeight > element.clientHeight;
};

export {isMobileDevice, scrollbarVisible};
