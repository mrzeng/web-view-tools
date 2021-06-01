type ErrorInfo = Record<string, any>;

interface EventResult<T = any> {
  data?: T;
  success: boolean;
  error?: ErrorInfo;
  eventId: string;
}

interface Listener {
  (...res: any[]): void;
}

const events: Record<string, Listener> = {};

export const registry = (key: string, listener: Listener) => {
  events[key] = listener;
};

function transformError(e: any): ErrorInfo {
  if (typeof e !== 'object' || e == null) {
    return {
      message: e,
    };
  }
  const keys = Object.getOwnPropertyNames(e);
  return keys.reduce((prev, key) => {
    return { ...prev, [key]: e[key] };
  }, {});
}

export const asyncEmit = ({ type, data, eventId }: { type: string; data: any; eventId: string }): Promise<EventResult> => {
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
    .catch(e => {
      return {
        error: transformError(e),
        success: false,
        eventId,
      };
    });
};
