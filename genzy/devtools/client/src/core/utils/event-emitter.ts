export type Event = string;
export type EventPayload = any;
export type EventHandler = (data: any) => any;

export const eventEmitter = {
  _events: {} as Record<Event, EventHandler[]>,

  dispatch(event: Event, data: EventPayload) {
    const callbacks = this._events[event];
    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback: EventHandler) => callback(data));
  },

  subscribe(event: Event, callback: EventHandler) {
    this._events[event] = [callback];
  },

  unsubscribe(event: Event) {
    if (!this._events[event]) {
      return;
    }
    delete this._events[event];
  },
};
