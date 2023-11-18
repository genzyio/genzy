export enum ServiceEvents {
  ON_EDGE_REMOVE = "ON_EDGE_REMOVE",
  ON_NODE_REMOVE = "ON_NODE_REMOVE",
}

export const serviceEventEmitter = {
  _events: {},

  dispatch(event: ServiceEvents, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  },

  subscribe(event: ServiceEvents, callback: (data: any) => any) {
    this._events[event] = [callback];
  },

  unsubscribe(event: ServiceEvents) {
    if (!this._events[event]) return;
    delete this._events[event];
  },
};
