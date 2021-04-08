let event: unknown = null;

interface Message {
  eventId: string;
}

interface Listener<T extends Message> {
  (res: T): void;
}

interface Listens<T extends Message> {
  [key: string]: Listener<T>;
}

interface Event<T extends Message> {
  on: (eventId: string, listener: Listener<T>) => void;
  emit: (param: Message) => void;
  off: (id: string) => void;
}

export default function createEvents<T extends Message>(): Event<T> {
  if (event) {
    // eslint-disable-next-line no-console
    console.warn('createEvent 不允许重复执行');
    return event as Event<T>;
  }

  const listens: Listens<T> = {};

  // 监听事件
  function on(eventId: string, listener: Listener<T>) {
    if (listens[eventId]) {
      throw new Error(`事件 eventId:${eventId}不能重复注册`);
    }
    listens[eventId] = listener;
  }

  // 触发事件
  function emit(param: T) {
    const { eventId } = param;
    if (!listens[eventId]) {
      throw new Error(`事件 eventId:${eventId}没有注册`);
    }
    listens[eventId](param);
  }

  // 移除事件
  function off(eventId: string) {
    delete listens[eventId];
  }

  event = {
    on,
    emit,
    off,
  };

  return event as Event<T>;
}
