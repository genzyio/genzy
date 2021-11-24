import axios from "axios";
import { lowerFirstLetter, ServiceRegistry } from "./service-registry";

const prefixToMethod = {
  get: 'get',
  read: 'get',
  fetch: 'get',
  add: 'post',
  create: 'post',
  post: 'post',
  put: 'put',
  update: 'put',
  delete: 'delete',
  remove: 'delete',
}

function camelToDashCase(key) {
  var result = key.replace(/([A-Z])/g, " $1" );
  return result.split(' ').join('-').toLowerCase().replace(/^-/g, '');
}

function getHttpMethod(fname) {
  const match = Object.keys(prefixToMethod).find(prefix => fname.match(new RegExp(`^${prefix}`, 'g')));
  return prefixToMethod[match] || 'post';
}

function getResourcePath(cname, fname) {
  return `${camelToDashCase(cname)}/${camelToDashCase(fname)}`;
}

const remoteCallHandler = {
  origin: 'http://localhost/',
  get: function(target, prop, receiver) {
    if(prop === '_class_name_') return target.constructor.name;
    if(typeof target[prop] === 'function') {
      return function(...args) {
        return new Promise((res, rej) => {
          axios({
            method: getHttpMethod(prop),
            data: {args},
            url: `${remoteCallHandler.origin.replace(/\/$/g, '')}/api/${getResourcePath(target.constructor.name, prop)}`
          }).then(r => res(r.data)).catch(rej);
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

export function RemoteProxyOf<T>(type, origin: string, serviceRegistry: ServiceRegistry): T {
  remoteCallHandler.origin = origin;
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), remoteCallHandler);
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}