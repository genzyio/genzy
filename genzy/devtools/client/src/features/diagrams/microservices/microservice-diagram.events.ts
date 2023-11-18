export enum MicroserviceEvents {
  ON_EDGE_REMOVE = "ON_EDGE_REMOVE",
  ON_NODE_REMOVE = "ON_NODE_REMOVE",
}

export const microserviceEventEmitter = {
  _events: {},

  dispatch(event: MicroserviceEvents, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  },

  subscribe(event: MicroserviceEvents, callback: (data: any) => any) {
    this._events[event] = [callback];
  },

  unsubscribe(event: MicroserviceEvents) {
    if (!this._events[event]) return;
    delete this._events[event];
  },
};
