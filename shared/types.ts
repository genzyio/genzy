import { getMethodsOfClassInstance, upperFirstLetter } from "./functions";

export type CustomInterceptorKey =
  | "beforeCustomInterceptors"
  | "afterCustomInterceptors";

export type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback | any;
  };
};

type CustomInterceptorsList<TInterceptorCallback> = {
  [classKey: string]: { [methodKey: string]: TInterceptorCallback[] };
};

export type Interceptors<TInterceptorCallback> = {
  beforeInterceptors: TInterceptorCallback[];
  afterInterceptors: TInterceptorCallback[];
  beforeCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
  afterCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
};

export class Interceptable<TInterceptorCallback> {
  protected interceptors: Interceptors<TInterceptorCallback> = {
    beforeInterceptors: [],
    afterInterceptors: [],
    beforeCustomInterceptors: {},
    afterCustomInterceptors: {},
  };

  protected interceptCustom(
    customInterceptors: CustomInterceptors<TInterceptorCallback>,
    customInterceptorsKey: CustomInterceptorKey
  ): void {
    Object.keys(customInterceptors).forEach((classK) => {
      const classKey = upperFirstLetter(classK);
      if (!this.interceptors[customInterceptorsKey][classKey]) {
        this.interceptors[customInterceptorsKey][classKey] = {};
      }
      const referenceObject =
        typeof customInterceptors[classK] !== "function"
          ? customInterceptors[classK]
          : new (customInterceptors[classK] as any)();
      const methodKeys: string[] =
        typeof customInterceptors[classK] !== "function"
          ? Object.keys(referenceObject)
          : (getMethodsOfClassInstance(referenceObject) as any);
      methodKeys.forEach((methodKey) => {
        if (!this.interceptors[customInterceptorsKey][classKey][methodKey]) {
          this.interceptors[customInterceptorsKey][classKey][methodKey] = [];
        }
        this.interceptors[customInterceptorsKey][classKey][methodKey].push(
          referenceObject[methodKey]
        );
      });
    });
  }
}

export type Modify<T, R> = Omit<T, keyof R> & R;

export type MetaInfo = {
  services: ServiceMetaInfo[];
  types: MetaTypesRegistry;
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
  result?: ComplexTypeReference;
};

export type Param = {
  source: ParamSource;
  name: string;
  type?: Type;
};

export type N1mblyConfig =
  | {
      path?: string;
    }
  | PathConfig;

export type ComplexType = {
  $typeName: string;
  $isArray: boolean;
} & {
  [key: ParamName]: Type;
};

export type ComplexTypeProperties = Omit<ComplexType, "$typeName" | "$isArray">;
export type ComplexTypeReference = Pick<ComplexType, "$typeName" | "$isArray">;

export type Action = Modify<
  Omit<RouteMetaInfo, "name">,
  {
    httpMethod?: HTTPMethod;
    path?: string;
    params?: Param[];
    result?: ComplexTypeReference;
  }
>;

export type PathConfig = {
  [key: MethodName]: Action;
};

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type ParamSource = "query" | "path" | "body";
export type Type =
  | "boolean"
  | "string"
  | "int"
  | "float"
  | ComplexTypeReference;
export type MethodName = string;
export type ParamName = string;
