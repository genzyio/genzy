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

export type QueryParamDefinition = {
  name: string;
  index: number;
};

export type NimblyConfig = {
  rootPath?: string;
} & TypesConfig | PathConfig;

export type MethodName = string;
export type ParamName = string;

export type TypesConfig = {
  types?: {
    [key: MethodName]: ({ index: number, type: Type })[];
  };
  returnTypes?: {
    [key: MethodName]: ComplexType;
  };
};

export type ComplexType = {
  [key: ParamName]: Type;
}

export type Type = "boolean" | "string" | "number" | ComplexType;

export type PathConfig = {
  [key: MethodName]: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path?: string;
    query?: { index: number, name: string }[];
    body?: boolean;
  };
};

export type ServiceMetaInfo = {
  name: string;
  $nimbly: NimblyConfig;
  routes: RouteMetaInfo[];
};

export type RouteMetaInfo = {
  httpMethod: string;
  methodName: MethodName;
  methodPath: string;
  path: string;
  pathParams?: string[];
  pathParamTypes?: Type[];
  queryParams?: string[];
  queryParamTypes?: Type[];
  body?: boolean;
  bodyType?: ComplexType;
  returnType?: ComplexType;
};
