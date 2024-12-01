import Bowser from "bowser";

export const isMobile = (userAgent: string) => {
    const browser = Bowser.getParser(userAgent);
    const { type } = browser.getPlatform();
    return "mobile" === type || "tablet" === type;
};

export const isIE = (userAgent: string) => {
    const browser = Bowser.getParser(userAgent);
    return browser.isBrowser("internet-explorer");
};

export const checkBrowserCompatibility = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase();

    // 检查基本的浏览器兼容性
    const isCompatible =
        /chrome|firefox|safari|edge/.test(userAgent) && 
        !/trident|msie/.test(userAgent); // 排除 IE 浏览器

    return isCompatible;
};
