export { Application, Request, Response, NextFunction } from "express";
import { Application, Request, Response, NextFunction } from "express";
import { N1mblyContainer } from "@n1mbly/client";
export { N1mblyContainer } from "@n1mbly/client";

export type N1mblyPluginParams = {
  n1mblyApi: N1mblyApi;
  app: Application;
};

export abstract class N1mblyPlugin {
  constructor(params?: { containers?: N1mblyContainer[] });

  beforeAll(params: N1mblyPluginParams): Promise<void> | void;
  beforeRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
    }
  ): Promise<void> | void;
  afterRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
      meta: ServiceMetaInfo & { types: MetaInfo["types"] };
    }
  ): Promise<void> | void;
  afterAll(params: N1mblyPluginParams): Promise<void> | void;
}

export class GenericType {}

export type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback;
  };
};

export type ErrorRegistry = { [key: string]: number };

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

  public addPlugin(plugin: N1mblyPlugin): N1mblyApi;
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
  name: string,
  options?: ParamDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Path(
  name: string,
  options?: Omit<ParamDecoratorOptions, "optional">
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function Body(
  options?: BodyDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function string(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function boolean(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function int(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function float(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function stringArray(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function booleanArray(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function intArray(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function floatArray(
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function type(
  type: Constructor,
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function arrayOf(
  type: Constructor,
  options?: TypeDecoratorOptions
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

export function Returns(
  type: Constructor | BasicType["type"]
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function ReturnsArrayOf(
  type: Constructor | BasicType["type"]
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;

// TYPES

export type N1mblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
  port?: number;
};

export type Modify<T, R> = Omit<T, keyof R> & R;

export type MetaInfo = {
  services: ServiceMetaInfo[];
  types: MetaTypesRegistry;
  n1mblyInfo?: N1mblyInfo;
};

export type MetaTypesRegistry = Record<string, ComplexTypeProperties>;

export type ServiceMetaInfo = {
  name: string;
  path: string;
  actions: RouteMetaInfo[];
};

export type RouteMetaInfo = {
  httpMethod: HTTPMethod;
  name: MethodName;
  path: string;
  params: Param[];
  result?: BasicType | ComplexTypeReference;
};

export type Param = {
  source: ParamSource;
  name: string;
  type?: Type;
  optional?: boolean;
};

export type N1mblyConfig = {
  path?: string;
  actions: ActionConfig;
  types?: MetaTypesRegistry;
};

export type ComplexType = {
  $typeName: string;
  $isArray: boolean;
  $isOptional: boolean;
} & {
  [key: ParamName]: ComplexTypeReference | BasicType;
};

export type ComplexTypeProperties = Omit<
  ComplexType,
  "$typeName" | "$isArray" | "$isOptional"
>;
export type ComplexTypeReference = Pick<
  ComplexType,
  "$typeName" | "$isArray" | "$isOptional"
>;

export type Action = Modify<
  Omit<RouteMetaInfo, "name">,
  {
    httpMethod?: HTTPMethod;
    path?: string;
    params?: Param[];
    result?: ComplexTypeReference;
  }
>;

export type ActionConfig = {
  [key: MethodName]: Action;
};

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type ParamSource = "query" | "path" | "body";
export type Type = BasicType | ComplexTypeReference;
export type MethodName = string;
export type ParamName = string;
export type BasicType = {
  type: "boolean" | "string" | "int" | "float";
  $isArray: boolean;
  $isOptional: boolean;
};

export type TypeDecoratorOptions = {
  optional?: boolean;
};

export type ParamDecoratorOptions = TypeDecoratorOptions & {
  type?: BasicType["type"];
  array?: boolean;
};

export type BodyDecoratorOptions = {
  type?:
    | BasicType
    | {
        new (): any;
      };
  optional?: boolean;
};
