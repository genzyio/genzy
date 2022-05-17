import axios from "axios";
import { ServiceRegistry } from "./service-registry";
import { lowerFirstLetter, getHttpMethod, camelToDashCase, extractPathParamsFrom, combineNimblyConfigs } from "../../shared/functions";
import { NimblyConfig, QueryParamDefinition } from "../../shared/types";

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
          const meta: NimblyConfig = combineNimblyConfigs(target?.$nimbly_config ?? {}, target?.$nimbly ?? {});
          const rootPath = meta?.rootPath != null ? meta?.rootPath : `/${camelToDashCase(className)}`;
          const methodPath = meta?.[prop]?.path != null ? meta?.[prop].path : `/${camelToDashCase(prop)}`;
          const httpMethod = meta?.[prop]?.method != null ? meta?.[prop].method.toLowerCase() : getHttpMethod(prop);

          const queryParamDefinitions = meta?.[prop]?.query ?? [];
          const params = {};
          queryParamDefinitions.forEach((q: QueryParamDefinition) => {
            params[q.name] = args[q.index];
          });

          const argsWithoudQueryParams = args.filter((_, i) => !queryParamDefinitions.find((q: QueryParamDefinition) => q.index === i));
          const body = argsWithoudQueryParams?.length ? argsWithoudQueryParams[argsWithoudQueryParams.length-1] : null;
          const [headers, data] = applyInterceptors(target, className, prop, {}, { data: body }, "before");

          let fullPath = `${target.$nimblyBasePath}${rootPath}${methodPath}`.replace('\/\/', '/');
          extractPathParamsFrom(fullPath).forEach((param: string, i: number) => {
            fullPath = fullPath.replace(`:${param}`, argsWithoudQueryParams[i]);
          });

          axios({
            method: httpMethod,
            data,
            headers,
            ...(Object.values(params).filter(v => v != null).length ? {params} : {}),
            url: `${target.$nimblyOrigin.replace(/\/$/g, '')}${fullPath}`
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

export function RemoteProxyOf<T>(type, origin: string, serviceRegistry: ServiceRegistry, interceptors?: any, basePath: string = '/api'): T {
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), remoteCallHandler);
  instance.$nimblyOrigin = origin;
  instance.$nimblyInterceptors = interceptors;
  instance.$nimblyBasePath = basePath;
  serviceRegistry.register(lowerFirstLetter(type.name || type.constructor.name), instance);
  return instance;
}