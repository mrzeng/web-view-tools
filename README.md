# 简介

提供了开发 PC 端 local webview 的一些通用工具

[![npm package](https://img.shields.io/npm/v/web-view-tools.svg?style=flat-square)](https://www.npmjs.com/package/web-view-tools) [![GitHub stars](https://img.shields.io/github/stars/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/stargazers) [![GitHub forks](https://img.shields.io/github/forks/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/network/members) [![NPM downloads](https://img.shields.io/npm/dm/web-view-tools.svg?style=flat-square)](https://www.npmjs.com/package/web-view-tools) [![GitHub issues](https://img.shields.io/github/issues/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/issues)

# 安装

```bash
yarn add web-view-tools --dev
# 或npm
npm i web-view-tools --save-dev
```

# [例子](https://github.com/noshower/web-view-tools/tree/main/example)

# 小程序与 h5 代码如何通信

## 场景 1：由 h5 端主动发起的事件

- 1. 小程序端调用 registry 注册事件
- 2. 在 local-webview 组件的 onMessage 处理函数中调用 trigger
- 3. h5 端根据需要调用 invoke, 使用小程序提供的能力

## 场景 2：由 小程序端主动发起的事件

- 1. h5 端调用 subscribe 订阅小程序端可能发起的消息
- 2. 小程序端调用 localwebview 的 postmessage 发起消息

# 示例

```xml
<view>
  <web-view id="{{localWebViewId}}" src="https://webview/index.html" onMessage="onWebViewMessage" mini>
  </web-view>
  <button size="default" type="primary" onTap="handleTap">发起通知</button>
</view>
```

```js
import { registry, trigger } from 'web-view-tools';
const localWebViewId = 'local';
Page({
  localWebView: null,

  data: {
    localWebViewId,
  },
  onReady() {
    // 提前注册预览图片的事件
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
    // local-webview 中调用 invoke时，调用 trigger，触发对应的事件
    trigger(value, localWebViewId);
  },
  handleTap() {
    my.createWebViewContext(localWebViewId).postMessage({
      eventId: 'printMessage', // eventId值 对应 subscribe 的type参数
      data: {
        message: '你有个通知',
      },
    });
  },
});
```

```html
// webview/index.html
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Local WebView Test</title>
    <link rel="stylesheet" href="assets/index.css" />
    <script type="text/javascript" src="https://appx/web-view.min.js"></script>
    <script type="text/javascript" src="assets/web-view-tools.js"></script>
    <script>
      function previewImage() {
        webViewTools
          .invoke({
            type: 'previewImage',
            data: {
              urls: [
                'https://gd2.alicdn.com/imgextra/i4/14647538/TB2O98vb8LN8KJjSZFPXXXoLXXa_!!14647538.jpg',
                'https://gd4.alicdn.com/imgextra/i4/14647538/TB2Y1qrbB_85uJjSZPfXXcp0FXa_!!14647538.jpg',
                'https://gd1.alicdn.com/imgextra/i1/14647538/TB2XxMCrbwTMeJjSszfXXXbtFXa_!!14647538.jpg',
              ],
            },
          })
          .then(res => {
            console.log(`调用 previewImage 的结果${previewImage}`);
          });
      }
      webViewTools.subscribe('printMessage', function (res) {
        console.log('%c 小程序消息: ', 'color:#ff0000;font-size:24px;', res);
      });
    </script>
  </head>

  <body>
    <div>
      <img src="image/qianniu.png" />
    </div>
    <div>
      <button onclick="previewImage();">预览图片</button>
    </div>
  </body>
</html>
```

# 用法

## 下面几个常量可以在 local-webview 中使用

- isMiniApp: boolean。true，表示插件类型是小程序。false，表示插件类型是 h5。 **注意：** isMiniApp 的判断逻辑是，代码的执行环境是否在 iframe 中。所以，如果代码本就有在 iframe 使用，请不要使用这个常量。
- isLocalWebview: boolean。true，表示代码环境是 local-webview, false 表示是非 local-webview

## 下面几个方法可以在 local-webview 中使用

### invoke

从 local-webview 中向小程序内发送消息，并在消息完成后触发回调。

#### 入参

Object 类型，属性如下：

| 属性 | 类型   | 是否必须 | 描述                                                 |
| ---- | ------ | -------- | ---------------------------------------------------- |
| type | string | 是       | 向小程序发起事件的名称，该名称必须在小程序中已经注册 |
| data | any    | 否       | 此事件，向小程序中传递的数据                         |

### subscribe

在 local-webview 中订阅消息，并在小程序触发事件后触发回调

**注意：同时注册相同名称的消息，会报错**

此方法适合由小程序发起事件，local-webview 触发回调的场景。

```js
my.createWebViewContext(localWebViewId).postMessage({
  eventId: string, // eventId值 对应 subscribe 的type参数
  data: any, // data 值传给 subscribe的回调
});
```

#### 入参

| 属性     | 类型     | 是否必须 | 描述                                                   |
| -------- | -------- | -------- | ------------------------------------------------------ |
| type     | string   | 是       | 要订阅的消息的名称                                     |
| callback | function | 是       | 消息发送后，触发的回调函数。该函数接收一个结果作为入参 |

### unsubscribe

取消订阅指定的消息

#### 入参

| 属性 | 类型   | 是否必须 | 描述               |
| ---- | ------ | -------- | ------------------ |
| type | string | 是       | 要取消的消息的名称 |

## 下面几个方法可以在小程序代码中使用

### registry

在小程序代码中，注册事件，这些事件是由 local-webview 主动触发的。

#### 入参

| 属性     | 类型     | 是否必须 | 描述                                                                                                   |
| -------- | -------- | -------- | ------------------------------------------------------------------------------------------------------ |
| type     | string   | 是       | 要注册的事件名称                                                                                       |
| listener | function | 是       | 事件函数，该函数的入参是 invoke 函数入参中的 data。返回结果，会传给 invoke，可在 then 的回调函数中拿到 |

### trigger

异步方法，在 local-webview 组件的监听函数中使用。

#### 入参

第一个参数来自 local-webview 组件的 onMessage 处理函数。

第二个参数可选，表示 local-webview 的 id。如果传了 id，会自动把结果传给 local-webview，并且 webViewContext 会根据 id 缓存一份。如果你的 local-webview 组件会销毁重新创建，就不要传 id。

#### 结果

返回结果是 registry 事件的执行结果
