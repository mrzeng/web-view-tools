import { registry, trigger } from 'web-view-tools';
const localWebViewId = 'local';
Page({
  localWebView: null,

  data: {
    localWebViewId,
  },
  onReady() {
    registry('previewImage', data => {
      return new Promise((resolve, reject) => {
        my.previewImage({
          urls: data.urls,
          success: function () {
            resolve('ok');
          },
          fail: function () {
            reject('fail');
          },
        });
      });
    });
  },
  onWebViewMessage({ detail: { value } }) {
    trigger(value, localWebViewId);
  },
  handleTap() {
    my.createWebViewContext(localWebViewId).postMessage({
      eventId: 'printMessage',
      data: {
        message: '你有个通知',
      },
    });
  },
});
