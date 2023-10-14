export { Application, Request, Response, NextFunction } from "express";
import { Application, Request, Response, NextFunction } from "express";

// CLIENT
export type CustomClientInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback;
  };
};

export type ClientInterceptorCallback = ({
  setHeader,
  getHeader,
  setBody,
  getBody,
}: {
  setHeader: (key: string, value: string) => any;
  getHeader: (key: string) => string;
  setBody: (body: any) => any;
  getBody: () => any;
}) => any;

interface Constructor {
  new (...args: any[]);
}

export class GenzyContainer {
  constructor();

  public interceptAllCalls(callback: InterceptorCallback): GenzyContainer;
  public interceptAllResults(callback: InterceptorCallback): GenzyContainer;
  public interceptCalls(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer;
  public interceptResults(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer;

  public addAccessToContainer(
    containerName: string,
    container: GenzyContainer
  ): GenzyContainer;
  public addLocalService(type: Constructor): GenzyContainer;
  public addLocalServices(...types: Constructor[]): GenzyContainer;
  public addRemoteService(origin: string, type: Constructor): GenzyContainer;
  public addRemoteServices(
    origin: string,
    ...types: Constructor[]
  ): GenzyContainer;

  public getServices(): any;
  public getAllServices(): any;
}
//

export type GenzyPluginParams = {
  genzyApi: GenzyApi;
  app: Application;
};

export abstract class GenzyPlugin {
  constructor(params?: { containers?: GenzyContainer[] });

  beforeAll(params: GenzyPluginParams): Promise<void> | void;
  beforeRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
    }
  ): Promise<void> | void;
  afterRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
      meta: ServiceMetaInfo & { types: MetaInfo["types"] };
    }
  ): Promise<void> | void;
  afterAll(params: GenzyPluginParams): Promise<void> | void;
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

export class GenzyApi {
  constructor();
  constructor(options: {
    app?: Application;
    genzyInfo?: GenzyInfo;
    basePath?: string;
  });

  public addPlugin(plugin: GenzyPlugin): GenzyApi;
  public intercept(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyApi;
  public interceptAfter(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyApi;
  public interceptAll(callback: InterceptorCallback): GenzyApi;
  public interceptAllAfter(callback: InterceptorCallback): GenzyApi;
  public withErrors(errors: ErrorRegistry): GenzyApi;
  public buildAppFrom(...containers: GenzyContainer[]): Application;
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

export type GenzyInfo = {
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
  genzyInfo?: GenzyInfo;
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

export type GenzyConfig = {
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
