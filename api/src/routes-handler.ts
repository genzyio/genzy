import { Application, NextFunction, Request, Response } from 'express';
import { ErrorHandler } from "./error-handler";

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
  'toLocaleString'
];

const prefixToMethod = {
  get: "get",
  read: "get",
  fetch: "get",
  add: "post",
  create: "post",
  post: "post",
  put: "put",
  update: "put",
  delete: "delete",
  remove: "delete",
};

function camelToDashCase(key) {
  var result = key.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("-").toLowerCase().replace(/^-/g, "");
}

function getHttpMethod(fname) {
  const match = Object.keys(prefixToMethod).find((prefix) =>
    fname.match(new RegExp(`^${prefix}`, "g"))
  );
  return prefixToMethod[match] || "post";
}

function getResourcePath(cname, fname) {
  return `${camelToDashCase(cname)}/${camelToDashCase(fname)}`;
}

export function getMethodsOfClassInstance(obj: any): string[] {
  const properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter((item: string) => !builtInMethods.includes(item) && typeof obj[item] === 'function') as string[];
}

export type ExpressCallback = (req: Request, res: Response, next: NextFunction) => any;

export type CustomInterceptors = {
  [classKey: string]: {
    [methodKey: string]: ExpressCallback
  }
};

type CustomInterceptorsList = { [classKey: string]: { [methodKey: string]: ExpressCallback[] } };

export type Interceptors = {
  beforeInterceptors: ExpressCallback[];
  afterInterceptors: ExpressCallback[];
  beforeCustomInterceptors: CustomInterceptorsList;
  afterCustomInterceptors: CustomInterceptorsList;
}

export function RegisterRoutesFor(instance, app: Application, interceptors?: Interceptors): void {
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
