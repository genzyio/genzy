export enum ClassEvents {
  ON_NODE_REMOVE = "ON_NODE_REMOVE",
}

export const classEventEmitter = {
  _events: {},

  dispatch(event: ClassEvents, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  },

  subscribe(event: ClassEvents, callback: (data: any) => any) {
    this._events[event] = [callback];
  },

  unsubscribe(event: ClassEvents) {
    if (!this._events[event]) return;
    delete this._events[event];
  },
};
