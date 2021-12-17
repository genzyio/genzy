import { Application, NextFunction, Request, Response } from 'express';
import { ErrorHandler } from "./error-handler";
import { getMethodsOfClassInstance, getHttpMethod, getResourcePath } from "../../shared/functions";

export function RegisterRoutesFor(instance, app: Application, interceptors?: any): void {
  getMethodsOfClassInstance(instance).forEach((method: string) => {
    const className = instance.constructor.name || instance._class_name_;
    const methodName = method;

    const handlers = [getServiceHandler(instance, method)];
    if(interceptors) {
      handlers.unshift(...interceptors.beforeInterceptors);
      handlers.push(...interceptors.afterInterceptors);
      if(interceptors.beforeCustomInterceptors[className])
        handlers.unshift(...(interceptors.beforeCustomInterceptors[className][methodName] || []));
      if(interceptors.afterCustomInterceptors[className])
        handlers.push(...(interceptors.afterCustomInterceptors[className][methodName] || []));
    }

    handlers.push((req: Request, res: Response, next: NextFunction) => { 
      console.log(res.locals._nimbly_result)
      res.json(res.locals._nimbly_result);
    });

    app[getHttpMethod(method)]('/api/' + getResourcePath(className, methodName), ...handlers);
  });
}

function getServiceHandler(instance, method: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = instance[method](...(req.body?.args || []));
    if (result instanceof Promise) {
      result.then(r => {
          res.locals._nimbly_result = r;
          next();
        })
        .catch((error: Error) => {
          ErrorHandler.forResponse(res).handleError(error);
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
