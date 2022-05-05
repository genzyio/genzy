import { Application, NextFunction, Request, Response } from 'express';
import { ErrorHandler, ErrorRegistry } from "./error-handler";
import { getMethodsOfClassInstance, getHttpMethod, getResourcePath, camelToDashCase } from "../../shared/functions";

export function RegisterRoutesFor(instance, app: Application, interceptors?: any, errorRegistry?: ErrorRegistry): void {
  getMethodsOfClassInstance(instance).forEach((method: string) => {
    const meta = instance?.$nimbly;
    const serviceClassName = instance.constructor.name || instance._class_name_;
    const rootPath = meta?.rootPath != null ? meta?.rootPath : camelToDashCase(serviceClassName);
    const methodPath = meta?.[method]?.path != null ? meta?.[method].path : camelToDashCase(method);
    const httpMethod = meta?.[method]?.method != null ? meta?.[method].method.toLowerCase() : getHttpMethod(method);

    const handlers = [getServiceHandler(instance, method, errorRegistry)];
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

    app[httpMethod](`/api/${rootPath}/${methodPath}`, ...handlers);
  });
}

function getServiceHandler(instance, method: string, errorRegistry: ErrorRegistry) {
  return (req: Request, res: Response, next: NextFunction) => {
    const pathParams = Object.values(req.params || {});
    const bodyArgs = req.body ? [req.body] : [];
    const result = instance[method](...[...(pathParams), ...(bodyArgs)]);
    if (result instanceof Promise) {
      result.then(r => {
          res.locals._nimbly_result = r;
          next();
        })
        .catch((error: Error) => {
          ErrorHandler.forResponse(res).handleError(error, errorRegistry);
        });
    } else if (result !== null && result !== undefined) {
      res.locals._nimbly_result = result;
      next();
    } else {
      res.status(500);
      res.send();
    }
  }
}
