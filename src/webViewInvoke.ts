import createEvents from './createEvents';
import { ID_PREFIX, uniqueId } from './uniqueId';

interface EventResult<T = any> {
  data: T;
  success: boolean;
  error?: string;
  eventId: string;
}

interface InvokeOptions<T = any> {
  success(result: EventResult<T>): void;
  error(error: Error): void;
  data: Record<string, any>;
}

const events = createEvents<EventResult>();

if (typeof my !== 'undefined') {
  my.onMessage = function onMessage(res: EventResult) {
    events.emit(res);
    if (res.eventId.indexOf(ID_PREFIX) > -1) {
      events.off(res.eventId);
    }
  };
}

export function invoke<T>(type: string, options: InvokeOptions<T>): void {
  const eventId = uniqueId();

  events.on(eventId, result => {
    if (result.success) {
      options.success(result.data);
    } else {
      options.error(new Error(result.error!));
    }
  });

  my.postMessage({
    type,
    data: options.data,
    eventId,
  });
}

export function invokePromise<T>(type: string, param: any): Promise<EventResult<T>> {
  return new Promise((resolve, reject) => {
    invoke<T>(type, {
      data: param,
      success: result => resolve(result),
      error: err => reject(err),
    });
  });
}

export function subscribe(type: string, callback: (...res: any[]) => void) {
  events.on(type, callback);
}

export function unsubscribe(type: string) {
  events.off(type);
}
