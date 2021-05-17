# 简介

提供了开发 PC 端 local webview 的一些通用工具

[![npm package](https://img.shields.io/npm/v/web-view-tools.svg?style=flat-square)](https://www.npmjs.com/package/web-view-tools) [![GitHub stars](https://img.shields.io/github/stars/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/stargazers) [![GitHub forks](https://img.shields.io/github/forks/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/network/members) [![NPM downloads](https://img.shields.io/npm/dm/web-view-tools.svg?style=flat-square)](https://www.npmjs.com/package/web-view-tools) [![GitHub issues](https://img.shields.io/github/issues/noshower/web-view-tools.svg)](https://github.com/noshower/web-view-tools/issues)

# 安装

```bash
yarn add web-view-tools --dev
# 或npm
npm i web-view-tools --save-dev
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

| 属性     | 类型     | 是否必须 | 描述                                              |
| -------- | -------- | -------- | ------------------------------------------------- |
| type     | string   | 是       | 要注册的事件名称                                  |
| listener | function | 是       | 事件函数，该函数的入参是 invoke 函数入参中的 data |

### trigger

异步方法，在 local-webview 组件的监听函数中使用。

#### 入参

入参来自 local-webview 组件的 onMessage 处理函数。

#### 结果

返回结果是 registry 事件的执行结果
