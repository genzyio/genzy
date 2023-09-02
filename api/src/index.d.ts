export { Application, Request, Response, NextFunction } from "express";
import { Application, NextFunction } from "express";
import { N1mblyContainer } from "@n1mbly/client";
export { N1mblyContainer } from "@n1mbly/client";

export class GenericType {}

type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback;
  };
};

type ErrorRegistry = { [key: string]: number };

type N1mblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
};

interface Constructor {
  new (...args: any[]);
}

export class N1mblyApi {
  constructor();
  constructor(options: {
    app?: Application;
    n1mblyInfo?: N1mblyInfo;
    basePath?: string;
  });

  public intercept(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyApi;
  public interceptAfter(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyApi;
  public interceptAll(callback: InterceptorCallback): N1mblyApi;
  public interceptAllAfter(callback: InterceptorCallback): N1mblyApi;
  public withErrors(errors: ErrorRegistry): N1mblyApi;
  public buildAppFrom(...containers: N1mblyContainer[]): Application;
}

export function Controller(
  rootPath: string,
  type?: Constructor
): (target: any) => void;
export function Get(path?: string): (target: any, propertyKey: string) => void;
export function Post(path?: string): (target: any, propertyKey: string) => void;
export function Put(path?: string): (target: any, propertyKey: string) => void;
export function Delete(
  path?: string
): (target: any, propertyKey: string) => void;
export function Patch(
  path?: string
): (target: any, propertyKey: string) => void;
export function Query(
  name: string
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Path(
  name: string
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Body(): (
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
) => void;

export function string(
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
): void;
export function boolean(
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
): void;
export function int(
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
): void;
export function float(
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
): void;
export function type(
  type: Constructor
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function arrayOf(
  type: Constructor
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Returns(
  type: Constructor
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function ReturnsArrayOf(
  type: Constructor
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
