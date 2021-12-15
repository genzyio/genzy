import axios from "axios";
import { lowerFirstLetter, ServiceRegistry } from "./service-registry";

const builtInMethods = [
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString',
  '$nimblyInterceptors',
  '$nimblyOrigin',
];

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

export function getMethodsOfClassInstance(obj: any): string[] {
  const properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter((item: string) => !builtInMethods.includes(item) && typeof obj[item] === 'function') as string[];
}

function getResourcePath(cname, fname) {
  return `${camelToDashCase(cname)}/${camelToDashCase(fname)}`;
}

function applyInterceptors(target, className, methodName, headers, body, type: "call" | "result") {
  const headersHolder = {...headers};
  const bodyHolder = {...body};
  const setHeader = (k, v) => headersHolder[k] = v;
  const getHeader = (k) => headersHolder[k];
  const setBody = (v) => bodyHolder.data = v;
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
          const [headers, data] = applyInterceptors(target, className, prop, {}, { data: {args} }, "call");
          axios({
            method: getHttpMethod(prop),
            data,
            headers,
            url: `${target.$nimblyOrigin.replace(/\/$/g, '')}/api/${getResourcePath(className, prop)}`
          }).then(r => {
            const [_, data] = applyInterceptors(target, className, prop, r.headers, { data: r.data }, "result");
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

export type CustomInterceptorKey = "callCustomInterceptors" | "resultCustomInterceptors";

export type CustomInterceptors = {
  [classKey: string]: {
    [methodKey: string]: InterceptorCallback | any
  }
};

export type InterceptorCallback = ({setHeader, getHeader, setBody, getBody}: 
  {setHeader: (key: string, value: string) => any, getHeader: (key: string) => string, setBody: (body: any) => any, getBody: () => any}) => any;

type CustomInterceptorsList = { [classKey: string]: { [methodKey: string]: InterceptorCallback[] } };

export type Interceptors = {
  callInterceptors: InterceptorCallback[];
  resultInterceptors: InterceptorCallback[];
  callCustomInterceptors: CustomInterceptorsList;
  resultCustomInterceptors: CustomInterceptorsList;
}

export function RemoteProxyOf<T>(type, origin: string, serviceRegistry: ServiceRegistry, interceptors?: Interceptors): T {
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), remoteCallHandler);
  instance.$nimblyOrigin = origin;
  instance.$nimblyInterceptors = interceptors;
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}