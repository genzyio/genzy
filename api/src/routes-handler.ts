import { Application, NextFunction, Request, Response } from 'express';
import { ErrorHandler, ErrorRegistry } from "./error-handler";
import { getMethodsOfClassInstance, getHttpMethod, camelToDashCase, extractPathParamsFrom, combineNimblyConfigs, getPathParamTypes, getBodyType } from "../../shared/functions";
import { NimblyConfig, QueryParamDefinition, RouteMetaInfo, ServiceMetaInfo } from '../../shared/types';

export function RegisterRoutesFor(instance, app: Application, interceptors?: any, errorRegistry?: ErrorRegistry, basePath: string = '/api'): ServiceMetaInfo {
  const serviceClassName = instance.constructor.name || instance._class_name_;
  const meta: NimblyConfig = combineNimblyConfigs(instance?.$nimbly_config ?? {}, instance?.$nimbly ?? {});
  const rootPath = meta?.rootPath != null ? meta?.rootPath : `/${camelToDashCase(serviceClassName)}`;

  const routes: RouteMetaInfo[] = getMethodsOfClassInstance(instance).map((method: string) => {
    const methodPath = meta?.[method]?.path != null ? meta?.[method].path : `/${camelToDashCase(method)}`;
    const httpMethod = meta?.[method]?.method != null ? meta?.[method].method.toLowerCase() : getHttpMethod(method);
    const queryParamDefinitions = meta?.[method]?.query ?? [];

    const handlers = [getServiceHandler(instance, method, errorRegistry, queryParamDefinitions)];
    if(interceptors) {
      handlers.unshift(...interceptors.beforeInterceptors);
      handlers.push(...interceptors.afterInterceptors);
      if(interceptors.beforeCustomInterceptors[serviceClassName])
        handlers.unshift(...(interceptors.beforeCustomInterceptors[serviceClassName][method] || []));
      if(interceptors.afterCustomInterceptors[serviceClassName])
        handlers.push(...(interceptors.afterCustomInterceptors[serviceClassName][method] || []));
    }

    handlers.push((req: Request, res: Response, next: NextFunction) => { 
      res.json(res.locals._nimbly_result);
    });

    const fullRoutePath = `${basePath}${rootPath}${methodPath}`.replace('\/\/', '/');
    app[httpMethod](fullRoutePath, ...handlers);

    const pathParams = extractPathParamsFrom(fullRoutePath);
    const queryParams: string[] = queryParamDefinitions.map(q => q.name);
    const methodParamTypes = meta?.types?.[method]?.sort((a: any, b: any) => a.index - b.index)?.map(t => t.type) ?? [];
    return {
      httpMethod,
      methodName: method,
      methodPath,
      path: fullRoutePath,
      pathParams,
      pathParamTypes: getPathParamTypes(pathParams, queryParamDefinitions, methodParamTypes),
      queryParams,
      queryParamTypes: queryParamDefinitions.map((q: QueryParamDefinition) => methodParamTypes[q.index]),
      body: !!meta?.[method]?.body,
      bodyType: getBodyType(methodParamTypes),
      returnType: meta?.returnTypes?.[method] ?? null
    }
  });
  return {
    name: serviceClassName,
    $nimbly: meta || {},
    routes
  }
}

function getServiceHandler(instance, method: string, errorRegistry: ErrorRegistry, queryParamDefinitions: QueryParamDefinition[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const pathParams = Object.values(req.params || {});
    const bodyArgs = req.body ? [req.body] : [];
    const argumentList = [...(pathParams), ...(bodyArgs)];
    queryParamDefinitions.sort((a, b) => a.index - b.index).forEach(({index, name}) => argumentList.splice(index, 0, req.query[name]));
    const result = instance[method](...argumentList);
    if (result instanceof Promise) {
      result.then(r => {
          res.locals._nimbly_result = r;
          next();
        })
        .catch((error: Error) => {
          ErrorHandler.forResponse(res).handleError(error, errorRegistry);
        });
    } else if (!!instance?.[method]) {
      res.locals._nimbly_result = result;
      next();
    } else {
      res.status(500);
      res.send();
    }
  }
}
