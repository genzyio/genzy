import axios from "axios";
import { ServiceRegistry } from "./service-registry";
import { lowerFirstLetter, getHttpMethod, getResourcePath } from "../../shared/functions";

function applyInterceptors(target: any, className: string, methodName: string, headers: any, body: any, type: "before" | "after") {
  const headersHolder = {...headers};
  const bodyHolder = {...body};
  const setHeader = (k: string, v: string) => headersHolder[k] = v;
  const getHeader = (k: string): string => headersHolder[k];
  const setBody = (v: any) => bodyHolder.data = v;
  const getBody = () => bodyHolder.data;
  const interceptors = [];
  if(target.$nimblyInterceptors?.[`${type}Interceptors`]) {
    interceptors.push(...target.$nimblyInterceptors?.[`${type}Interceptors`]);
  }
  if(target.$nimblyInterceptors?.[`${type}CustomInterceptors`][className]) {
    interceptors.push(...(target.$nimblyInterceptors?.[`${type}CustomInterceptors`][className][methodName] || []));
  }
  interceptors.forEach(cb => cb({setHeader, setBody, getHeader, getBody}));
  return [headersHolder, bodyHolder.data]
}

const remoteCallHandler = {
  get: function(target, prop, receiver) {
    const className = target.constructor.name;
    if(prop === '_class_name_') return className;
    if(typeof target[prop] === 'function') {
      return function(...args) {
        return new Promise((res, rej) => {
          const [headers, data] = applyInterceptors(target, className, prop, {}, { data: {args} }, "before");
          axios({
            method: getHttpMethod(prop),
            data,
            headers,
            url: `${target.$nimblyOrigin.replace(/\/$/g, '')}/api/${getResourcePath(className, prop)}`
          }).then(r => {
            const [_, data] = applyInterceptors(target, className, prop, r.headers, { data: r.data }, "after");
            res(data);
          }).catch(rej);
        });
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

export function RemoteProxyOf<T>(type, origin: string, serviceRegistry: ServiceRegistry, interceptors?: any): T {
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), remoteCallHandler);
  instance.$nimblyOrigin = origin;
  instance.$nimblyInterceptors = interceptors;
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}