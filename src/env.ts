// 如果一个窗口没有父窗口,则它的 parent 属性为自身的引用. 即页面不是嵌入在小程序 web-view里的
export const isMiniApp = window.self !== window.top;
// local web-view 的url 是https://webview/ 开头的
export const isLocalWebview = window.location.href.indexOf('https://webview/') === 0;

// 页面是嵌入在web-view且不是 local web-view,就是 web-view
export const isWebView = isMiniApp && !isLocalWebview;
