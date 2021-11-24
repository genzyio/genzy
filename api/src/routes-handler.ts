import { Application, Request, Response } from 'express';
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

const getMethods = (obj: any) => {
  const properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter((item: string) => !builtInMethods.includes(item) && typeof obj[item] === 'function');
}

export function RegisterRoutesFor(instance, app: Application): void {
  getMethods(instance).forEach((m: string) => {
    app[getHttpMethod(m)]('/api/' + getResourcePath(instance.constructor.name || instance._class_name_, m), (req: Request, res: Response, next: Function) => {
      const result = instance[m](...(req.body?.args || []));
      if (result instanceof Promise) {
        result.then(r => {
            res.json(r);
          })
          .catch((error: Error) => {
            ErrorHandler.forResponse(res).handleError(error);
          });
      } else if (result !== null && result !== undefined) {
        res.json(result);
      } else {
        res.status(500);
        res.send();
      }
    });
  });
}
