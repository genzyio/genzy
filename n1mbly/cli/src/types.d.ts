export declare type CustomInterceptorKey = "beforeCustomInterceptors" | "afterCustomInterceptors";
export declare type CustomInterceptors<TInterceptorCallback> = {
    [classKey: string]: {
        [methodKey: string]: TInterceptorCallback | any;
    };
};
declare type CustomInterceptorsList<TInterceptorCallback> = {
    [classKey: string]: {
        [methodKey: string]: TInterceptorCallback[];
    };
};
export declare type Interceptors<TInterceptorCallback> = {
    beforeInterceptors: TInterceptorCallback[];
    afterInterceptors: TInterceptorCallback[];
    beforeCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
    afterCustomInterceptors: CustomInterceptorsList<TInterceptorCallback>;
};
export declare class Interceptable<TInterceptorCallback> {
    protected interceptors: Interceptors<TInterceptorCallback>;
    protected interceptCustom(customInterceptors: CustomInterceptors<TInterceptorCallback>, customInterceptorsKey: CustomInterceptorKey): void;
}
export declare type N1mblyInfo = {
    version?: string;
    name?: string;
    description?: string;
    basePath?: string;
};
export declare type Modify<T, R> = Omit<T, keyof R> & R;
export declare type MetaInfo = {
    services: ServiceMetaInfo[];
    types: MetaTypesRegistry;
    n1mblyInfo?: N1mblyInfo;
};
export declare type MetaTypesRegistry = Record<string, ComplexTypeProperties>;
export declare type ServiceMetaInfo = {
    name: string;
    path?: string;
    actions: RouteMetaInfo[];
};
export declare type RouteMetaInfo = {
    httpMethod?: HTTPMethod;
    name: MethodName;
    path?: string;
    params: Param[];
    result?: ComplexTypeReference;
};
export declare type Param = {
    source?: ParamSource;
    name: string;
    type?: Type;
    optional?: boolean;
};
export declare type N1mblyConfig = {
    path?: string;
    actions: ActionConfig;
    types?: MetaTypesRegistry;
};
export declare type ComplexType = {
    $typeName: string;
    $isArray: boolean;
} & {
    [key: ParamName]: {
        type: Type;
        $isOptional: boolean;
    };
};
export declare type ComplexTypeProperties = Omit<ComplexType, "$typeName" | "$isArray">;
export declare type ComplexTypeReference = Pick<ComplexType, "$typeName" | "$isArray">;
export declare type Action = Modify<Omit<RouteMetaInfo, "name">, {
    httpMethod?: HTTPMethod;
    path?: string;
    params?: Param[];
    result?: ComplexTypeReference;
}>;
export declare type ActionConfig = {
    [key: MethodName]: Action;
};
export declare type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export declare type ParamSource = "query" | "path" | "body";
export declare type Type = BasicType | ComplexTypeReference;
export declare type MethodName = string;
export declare type ParamName = string;
export declare type BasicType = "boolean" | "string" | "int" | "float";
export declare type TypeDecoratorOptions = {
    optional?: boolean;
};
export declare type ParamDecoratorOptions = TypeDecoratorOptions & {
    type?: BasicType;
};
export declare type BodyDecoratorOptions = {
    type?: BasicType | {
        new (): any;
    };
    optional?: boolean;
};