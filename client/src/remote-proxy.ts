import axios from "axios";
import { ServiceRegistry } from "./service-registry";
import { lowerFirstLetter, getHttpMethod, camelToKebabCase, combineNimblyConfigs, formParamsOf } from "../../shared/functions";
import { NimblyConfig, Param } from "../../shared/types";

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
  get: function(target, method, receiver) {
    const className = target.constructor.name;
    if(method === '_class_name_') return className;
    if(typeof target[method] === 'function') {
      return function(...args) {
        return new Promise((res, rej) => {
          const meta: NimblyConfig = combineNimblyConfigs(target?.$nimbly_config ?? {}, target?.$nimbly ?? {});
          const rootPath = meta?.path != null ? meta?.path : `/${camelToKebabCase(className)}`;
          const methodPath = meta?.[method]?.path != null ? meta?.[method].path : `/${camelToKebabCase(method)}`;
          const httpMethod = meta?.[method]?.httpMethod != null ? meta?.[method].httpMethod.toLowerCase() : getHttpMethod(method);
          const actionParams = formParamsOf(method, meta?.[method]);

          const queryParams = {};
          actionParams.forEach((p: Param, i) => {
            if (p.source === 'query')
              queryParams[p.name] = args[i];
          });

          const bodyParamIndex = actionParams.findIndex(p => p.source === 'body');
          const body = bodyParamIndex !== -1 ? args[bodyParamIndex] : null;
          const [headers, data] = applyInterceptors(target, className, method, {}, { data: body }, "before");

          let fullPath = `${rootPath}${methodPath}`.replace('\/\/', '/');
          actionParams.forEach((param, i) => {
            if (param.source === 'path')
              fullPath = fullPath.replace(`:${param.name}`, args[i]);
          });

          axios({
            method: httpMethod,
            data,
            headers,
            ...(Object.values(queryParams).filter(v => v != null).length ? {params: queryParams} : {}),
            url: `${target.$nimblyOrigin.replace(/\/$/g, '')}${fullPath}`
          }).then(r => {
            const [_, data] = applyInterceptors(target, className, method, r.headers, { data: r.data }, "after");
            res(data);
          }).catch(rej);
        });
      }
    }
    return target[method]
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
  instance.$nimblyOrigin = new URL(origin).toString();
  instance.$nimblyInterceptors = interceptors;
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}