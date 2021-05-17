interface EventResult<T = any> {
  data?: T;
  success: boolean;
  error?: string;
  eventId: string;
}

interface Listener {
  (...res: any[]): void;
}

const events: Record<string, Listener> = {};

export const registry = (type: string, listener: Listener) => {
  events[type] = listener;
};

export const trigger = ({ type, data, eventId }: { type: string; data: any; eventId: string }, webViewId: string): Promise<EventResult> => {
  return Promise.resolve()
    .then(() => {
      const fn = events[type];
      if (typeof fn === 'undefined') {
        throw new Error(`未定义事件：${type}`);
      }
      return fn(data);
    })
    .then(result => {
      return {
        data: result,
        success: true,
        eventId,
      };
    })
    .catch((e: Error) => {
      const separator = ':::';
      if (e.toString && e.toString().split(separator)[1]) {
        return {
          error: e.toString().split(separator)[1],
          success: false,
          eventId,
        };
      }
      return {
        error: e.message || e.toString(),
        success: false,
        eventId,
      };
    })
    .then(result => {
      if (webViewId) {
        const webViewContext = my.createWebViewContext(webViewId);
        if (!webViewContext) {
          throw new Error(`id 为 ${webViewId} 的webview组件不存在`);
        }
        webViewContext.postMessage(result);
      }
      return result;
    });
};
