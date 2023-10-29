export enum Events {
  PLUGIN_INSTALLED = "PLUGIN_INSTALLED",
  PLUGIN_UNINSTALLED = "PLUGIN_UNINSTALLED",
  // PLUGIN_UPDATED = "PLUGIN_UPDATED"
}
export const eventEmitter = {
  _events: {},
  dispatch(event: Events, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  },
  subscribe(event: Events, callback: (data: any) => any) {
    this._events[event] = [callback];
  },
  unsubscribe(event: Events) {
    if (!this._events[event]) return;
    delete this._events[event];
  },
};
