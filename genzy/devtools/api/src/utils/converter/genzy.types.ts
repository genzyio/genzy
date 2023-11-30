export type GenzyGeneratorInput = {
  services: GenzyService[];
  types: Record<string, GenzyType>;
  plugins: GenzyPlugin[];
  genzyInfo: GenzyInfo;
};

export type GenzyInfo = {
  name: string;
  description: string;
  version: string;
  basePath: string;
};

export type GenzyPlugin = {
  name: string;
  services: string[];
};

// Service

export type GenzyService = GenzyController | GenzyLocalService | GenzyRemoteProxy;

export type GenzyServiceBase = {
  name: string;
  actions: GenzyAction[];
};

export type GenzyController = GenzyServiceBase & {
  type: "Controller";
  path: string;
  dependencies: string[];
};

export type GenzyLocalService = GenzyServiceBase & {
  type: "LocalService";
  dependencies: string[];
};

export type GenzyRemoteProxy = GenzyServiceBase & {
  type: "RemoteProxy";
  host: string;
  path: string;
};

// Actions

export type GenzyAction = GenzyEndpoint | GenzyFunction;

export type GenzyActionBase = {
  name: string;
  result: GenzyTypeAttributes;
};

export type GenzyFunctionParameter = {
  name: string;
  type: GenzyTypeAttributes;
};

export type GenzyFunction = GenzyActionBase & {
  params: GenzyFunctionParameter[];
};

export type GenzyEndpointParameter = {
  name: string;
  type: GenzyTypeAttributes;
  source: string;
};

export type GenzyEndpoint = GenzyActionBase & {
  httpMethod: "get" | "post" | "put" | "delete";
  path: string;
  params: GenzyEndpointParameter[];
};

// Types

export type GenzyType = Record<string, GenzyTypeAttributes>;

export type GenzyTypeAttributes = GenzyPrimitiveTypeAttributes | GenzyUserDefinedTypeAttributes;

export type GenzyTypeAttributesBase = {
  $isOptional?: boolean;
  $isArray?: boolean;
};

export type GenzyPrimitiveTypeAttributes = GenzyTypeAttributesBase & {
  type?: string;
};

export type GenzyUserDefinedTypeAttributes = GenzyTypeAttributesBase & {
  $typeName?: string;
};
