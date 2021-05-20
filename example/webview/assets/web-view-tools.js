!(function (e, n) {
  'object' == typeof exports && 'undefined' != typeof module
    ? n(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], n)
    : n(((e = 'undefined' != typeof globalThis ? globalThis : e || self).webViewTools = {}));
})(this, function (e) {
  'use strict';
  var n = null;
  var t = 0,
    r = Math.ceil(1e4 * Math.random()) + '_';
  var o = (function () {
    if (n) return console.warn('createEvent 不允许重复执行'), n;
    var e = {};
    return (n = {
      on: function (n, t) {
        if (e[n]) throw new Error('事件 eventId:' + n + '不能重复注册');
        e[n] = t;
      },
      emit: function (n) {
        var t = n.eventId;
        if (!e[t]) throw new Error('事件 eventId:' + t + '没有注册');
        e[t](n);
      },
      off: function (n) {
        delete e[n];
      },
    });
  })();
  function i(e) {
    var n = '' + r + (t += 1);
    o.on(n, function (n) {
      if (n.success) e.success(n.data);
      else
        try {
          e.error(JSON.parse(n.error));
        } catch (t) {
          e.error(new Error(n.error));
        }
    }),
      my.postMessage({ type: e.type, data: e.data, eventId: n });
  }
  'undefined' != typeof my &&
    (my.onMessage = function (e) {
      o.emit(e), e.eventId.indexOf(r) > -1 && o.off(e.eventId);
    });
  var f = 'undefined' != typeof window && /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent),
    s = ('undefined' != typeof window && window.self !== window.top) || f,
    d = 'undefined' != typeof window && 0 === window.location.href.indexOf('https://webview/'),
    u = {};
  (e.callbackInvoke = i),
    (e.invoke = function (e) {
      return new Promise(function (n, t) {
        i({
          type: e.type,
          data: e.data,
          success: function (e) {
            return n(e);
          },
          error: function (e) {
            return t(e);
          },
        });
      });
    }),
    (e.isLocalWebview = d),
    (e.isMiniApp = s),
    (e.registry = function (e, n) {
      u[e] = n;
    }),
    (e.subscribe = function (e, n) {
      o.on(e, n);
    }),
    (e.trigger = function (e, n) {
      var t = e.type,
        r = e.data,
        o = e.eventId;
      return Promise.resolve()
        .then(function () {
          var e = u[t];
          if (void 0 === e) throw new Error('未定义事件：' + t);
          return e(r);
        })
        .then(function (e) {
          return { data: e, success: !0, eventId: o };
        })
        .catch(function (e) {
          return e.toString && e.toString().split(':::')[1]
            ? { error: e.toString().split(':::')[1], success: !1, eventId: o }
            : { error: e.message || e.toString(), success: !1, eventId: o };
        })
        .then(function (e) {
          if (n) {
            var t = my.createWebViewContext(n);
            if (!t) throw new Error('id 为 ' + n + ' 的webview组件不存在');
            t.postMessage(e);
          }
          return e;
        });
    }),
    (e.unsubscribe = function (e) {
      o.off(e);
    }),
    Object.defineProperty(e, '__esModule', { value: !0 });
});
