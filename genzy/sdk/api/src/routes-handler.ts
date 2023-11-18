import { Application, NextFunction, Request, Response } from "express";
import { ErrorHandler, ErrorRegistry } from "./error-handler";
import {
  camelToKebabCase,
  combineGenzyConfigs,
  formParamsOf,
  getHttpMethod,
  getMethodsOfClassInstance,
} from "../../shared/functions";
import {
  ComplexTypeReference,
  MetaTypesRegistry,
  GenzyConfig,
  Param,
  RouteMetaInfo,
  ServiceMetaInfo,
} from "../../shared/types";

export function RegisterRoutesFor(
  instance,
  app: Application,
  interceptors?: any,
  errorRegistry?: ErrorRegistry,
  basePath: string = "/api"
): { service: ServiceMetaInfo & { types: MetaTypesRegistry } } {
  const serviceClassName = instance.constructor.name || instance._class_name_;
  const meta: GenzyConfig = combineGenzyConfigs(
    instance?.$genzy_config ?? {},
    instance?.$genzy ?? {}
  );
  const rootPath =
    meta?.path != null
      ? (meta?.path as string)
      : `/${camelToKebabCase(serviceClassName)}`;

  const types: MetaTypesRegistry = meta.types;

  const routes: RouteMetaInfo[] = getMethodsOfClassInstance(instance)
    .map((method: string) => {
      const action = meta?.actions?.[method];
      if (!action) return;

      const methodPath =
        action.path != null
          ? meta?.actions?.[method].path
          : `/${camelToKebabCase(method)}`;
      const httpMethod =
        action.httpMethod != null
          ? meta?.actions?.[method].httpMethod.toLowerCase()
          : getHttpMethod(method);
      const params = formParamsOf(method, meta?.actions?.[method]);
      const result: ComplexTypeReference | undefined = action.result;

      const handlers = [
        getServiceHandler(instance, method, errorRegistry, params),
      ];
      if (interceptors) {
        handlers.unshift(...interceptors.beforeInterceptors);
        handlers.push(...interceptors.afterInterceptors);
        if (interceptors.beforeCustomInterceptors[serviceClassName]) {
          handlers.unshift(
            ...(interceptors.beforeCustomInterceptors[serviceClassName][
              method
            ] || [])
          );
        }
        if (interceptors.afterCustomInterceptors[serviceClassName]) {
          handlers.push(
            ...(interceptors.afterCustomInterceptors[serviceClassName][
              method
            ] || [])
          );
        }
      }

      handlers.push((req: Request, res: Response, next: NextFunction) => {
        res.json(res.locals._genzy_result);
      });

      const fullRoutePath = `${basePath}${rootPath}${methodPath}`.replace(
        "//",
        "/"
      );
      app[httpMethod](fullRoutePath, ...handlers);

      return {
        httpMethod,
        name: method,
        path: methodPath,
        params: params.map(({ name, source, type, optional }) => ({
          name,
          source,
          type,
          optional,
        })),
        ...(result ? { result } : {}),
      };
    })
    .filter((r) => !!r) as RouteMetaInfo[];
  return {
    service: {
      name: serviceClassName,
      actions: routes,
      path: rootPath,
      types,
    },
  };
}

function getServiceHandler(
  instance,
  method: string,
  errorRegistry: ErrorRegistry,
  params: Param[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const argumentList = params.map((p) => {
      if (p.source === "body") {
        return req.body;
      } else if (p.source === "path") {
        return req.params[p.name];
      } else if (p.source === "query") {
        return req.query[p.name];
      }
    });
    if (req.body && !params.find((p) => p.source === "body")) {
      argumentList.push(req.body);
    }
    const result = instance[method](...argumentList);
    if (result instanceof Promise) {
      result
        .then((r) => {
          res.locals._genzy_result = r;
          next();
        })
        .catch((error: Error) => {
          ErrorHandler.forResponse(res).handleError(error, errorRegistry);
        });
    } else if (!!instance?.[method]) {
      res.locals._genzy_result = result;
      next();
    } else {
      res.status(500);
      res.send();
    }
  };
}
