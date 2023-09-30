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

export type N1mblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
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
