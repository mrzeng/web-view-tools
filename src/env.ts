const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

// 如果一个窗口没有父窗口,则它的 parent 属性为自身的引用. 即页面不是嵌入在小程序 web-view里的
// 小程序中没有window 因此需要使用 typeof 判断
// 加上isMobile的原因是，小程序机器审核是在华为手机上进行的。这里，如果h5页面的环境是手机端，就判断为小程序环境
export const isMiniApp = (typeof window !== 'undefined' && window.self !== window.top) || isMobile;
// local web-view 的url 是https://webview/ 开头的
export const isLocalWebview = typeof window !== 'undefined' && window.location.href.indexOf('https://webview/') === 0;

// 页面是嵌入在web-view且不是 local web-view,就是 web-view
export const isWebView = isMiniApp && !isLocalWebview;
