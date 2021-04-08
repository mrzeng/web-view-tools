interface EventResult<T = any> {
  data?: T;
  success: boolean;
  error?: Error;
  eventId: string;
}

interface Listener {
  (...res: any[]): void;
}

const events: Record<string, Listener> = {};

export const registry = (key: string, listener: Listener) => {
  events[key] = listener;
};

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
        error: e,
        success: false,
        eventId,
      };
    });
};
