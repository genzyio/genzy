import { BUILT_IN_METHODS, BUILT_IN_PROPS } from "../../shared/constants";

export class ServiceRegistry {
  private registry: object = getRefProxy();

  public register(key: string, instance?: any) {
    this.registry[key] = instance;
  }

  public getAll() {
    return this.registry;
  }
}

export const getRefProxy = () =>
  new Proxy(
    { $proxy: null },
    {
      get: (target, prop) => {
        if (target.$proxy) {
          return target.$proxy[prop];
        }
        if (
          [...BUILT_IN_METHODS, ...BUILT_IN_PROPS].includes(prop.toString())
        ) {
          return target[prop];
        }
        if (!target[prop]) {
          target[prop] = getRefProxy();
        }
        return target[prop];
      },
      set: (target, prop, value) => {
        if (
          [...BUILT_IN_METHODS, ...BUILT_IN_PROPS].includes(prop.toString())
        ) {
          target[prop] = value;
          return true;
        }
        if (prop === "$proxy") {
          target[prop] = value;
          return true;
        }
        if (prop in target) {
          target[prop].$proxy = value;
        } else {
          target[prop] = value;
        }
        return true;
      },
    }
  );
