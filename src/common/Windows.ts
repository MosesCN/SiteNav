// define window size
enum WindowSize {
    XS,
    SM,
    MD,
    LG,
    XL
}

const isMobile = () => {
    // reference: https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html
    return window.matchMedia("only screen and (max-width: 760px)").matches || window.matchMedia("(any-pointer:coarse)").matches;
}

const getWindowSize = function() {
    // size standard defined from Bootstrap
    if (window.innerWidth < 768) {
        // [0, 768)
        return WindowSize.XS;
    } else if (window.innerWidth < 992) {
        // [768, 992)
        return WindowSize.SM;
    } else if (window.innerWidth < 1200) {
        // [992, 1200)
        return WindowSize.MD;
    } else if (window.innerWidth < 1920){
        // [1200, 1920)
        return WindowSize.LG;
    } else {
        // [1920, +∞)
        return WindowSize.XL;
    }
}

export { isMobile, getWindowSize, WindowSize }