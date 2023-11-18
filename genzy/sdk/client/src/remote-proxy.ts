
import * as axios from 'axios';
import { ServiceRegistry } from "./service-registry";
import {
  getHttpMethod,
  camelToKebabCase,
  combineGenzyConfigs,
  formParamsOf,
} from "../../shared/functions";
import { GenzyConfig, Param } from "../../shared/types";

async function applyInterceptors(
  target: any,
  className: string,
  methodName: string,
  headers: any,
  body: any,
  type: "before" | "after"
) {
  const headersHolder = { ...headers };
  const bodyHolder = { ...body };
  const setHeader = (k: string, v: string) => (headersHolder[k] = v);
  const getHeader = (k: string): string => headersHolder[k];
  const setBody = (v: any) => (bodyHolder.data = v);
  const getBody = () => bodyHolder.data;
  const interceptors = [];
  if (target.$genzyInterceptors?.[`${type}Interceptors`]) {
    interceptors.push(...target.$genzyInterceptors?.[`${type}Interceptors`]);
  }
  if (target.$genzyInterceptors?.[`${type}CustomInterceptors`][className]) {
    interceptors.push(
      ...(target.$genzyInterceptors?.[`${type}CustomInterceptors`][className][
        methodName
      ] || [])
    );
  }
  for (let i = 0; i < interceptors.length; i++) {
    const cb = interceptors[i];
    await cb({ setHeader, setBody, getHeader, getBody });
  }
  return [headersHolder, bodyHolder.data];
}

const remoteCallHandler = {
  get: function (target, method, receiver) {
    const className = target.constructor.name;
    if (method === "_class_name_") return className;
    if (typeof target[method] === "function") {
      return function (...args) {
        return new Promise(async (res, rej) => {
          const meta: GenzyConfig = combineGenzyConfigs(
            target?.$genzy_config ?? {},
            target?.$genzy ?? {}
          );
          const rootPath =
            meta?.path != null ? meta?.path : `/${camelToKebabCase(className)}`;
          const methodPath =
            meta?.actions?.[method]?.path != null
              ? meta?.actions?.[method].path
              : `/${camelToKebabCase(method)}`;
          const httpMethod =
            meta?.actions?.[method]?.httpMethod != null
              ? meta?.actions?.[method].httpMethod.toLowerCase()
              : getHttpMethod(method);
          const actionParams = formParamsOf(method, meta?.actions?.[method]);

          const queryParams = {};
          actionParams.forEach((p: Param, i) => {
            if (p.source === "query") queryParams[p.name] = args[i];
          });

          const bodyParamIndex = actionParams.findIndex(
            (p) => p.source === "body"
          );
          const body = bodyParamIndex !== -1 ? args[bodyParamIndex] : null;
          const [headers, data] = await applyInterceptors(
            target,
            className,
            method,
            {},
            { data: body },
            "before"
          );

          let fullPath = `${rootPath}${methodPath}`.replace("//", "/");
          actionParams.forEach((param, i) => {
            if (param.source === "path")
              fullPath = fullPath.replace(`:${param.name}`, args[i]);
          });

          axios.default({
            method: httpMethod,
            data,
            headers,
            ...(Object.values(queryParams).filter((v) => v != null).length
              ? { params: queryParams }
              : {}),
            url: `${target.$genzyOrigin.replace(/\/$/g, "")}${fullPath}`,
          })
            .then(async (r) => {
              const [_, data] = await applyInterceptors(
                target,
                className,
                method,
                r.headers,
                { data: r.data },
                "after"
              );
              res(data);
            })
            .catch(rej);
        });
      };
    }
    return target[method];
  },
};

const constructHandler = {
  construct: function (target, args) {
    const serviceRegistry = args[0] as ServiceRegistry;
    const newInstance = new target(serviceRegistry.getAll(), ...args);
    return newInstance;
  },
};

export function RemoteProxyOf<T>(
  type,
  origin: string,
  serviceRegistry: ServiceRegistry,
  interceptors?: any
): T {
  const creator = new Proxy(type, constructHandler);
  const instance = new Proxy(new creator(serviceRegistry), remoteCallHandler);
  instance.$genzyOrigin = new URL(origin).toString();
  instance.$genzyInterceptors = interceptors;
  return instance;
}
