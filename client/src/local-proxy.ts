import { lowerFirstLetter } from "../../shared/functions";
import { ServiceRegistry } from "./service-registry";

const localCallHandler = {
  get: function(target, prop, receiver) {
    if(prop === '_class_name_') return target.constructor.name;
    if(typeof target[prop] === 'function') {
      return function(...args) {
        const result = target[prop].apply(this, args);
          if(result instanceof Promise) {
            return new Promise((res, rej) => {
              result.then(r => res(r)).catch(rej);
            });
          } else {
            return result;
          }
      }
    }
    return target[prop]
  },
}

const constructHandler = {
  construct: function(target, args) {
    const serviceRegistry = args[0] as ServiceRegistry;
    const newInstance = new target(serviceRegistry.getAll(), ...args);
    return newInstance;
  },
}

export function LocalProxyOf<T>(type, serviceRegistry: ServiceRegistry): T {
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), localCallHandler);
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}