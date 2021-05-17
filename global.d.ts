declare namespace my {
  function onMessage(res: any) {}
  function postMessage(params: any) {}
  function createWebViewContext(webViewId: string): { postMessage: (params: any) => void } {}
}
