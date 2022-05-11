import { getMethodsOfClassInstance, upperFirstLetter } from "./functions";

export type CustomInterceptorKey = "beforeCustomInterceptors" | "afterCustomInterceptors";

export type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback | any
  }
};

type CustomInterceptorsList<TInterceptorCallback> = { [classKey: string]: { [methodKey: string]: TInterceptorCallback[] } };

export type Interceptors<TInterceptorCallback> = {
  beforeInterceptors: TInterceptorCallback[];
  afterInterceptors: TInterceptorCallback[];
  beforeCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
  afterCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
}

export class Interceptable<TInterceptorCallback> {
  protected interceptors: Interceptors<TInterceptorCallback> = {
    beforeInterceptors: [],
    afterInterceptors: [],
    beforeCustomInterceptors: {},
    afterCustomInterceptors: {}
  }

  protected interceptCustom(customInterceptors: CustomInterceptors<TInterceptorCallback>, customInterceptorsKey: CustomInterceptorKey): void {
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
}

export type ServiceMetaInfo = {
  name: string;
  $nimbly: any;
  routes: RouteMetaInfo[];
}

export type RouteMetaInfo = {
  httpMethod: string;
  methodName: string;
  methodPath: string;
  path: string;
  pathParams?: string[];
  body?: boolean;
}