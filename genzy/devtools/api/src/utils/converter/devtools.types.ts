export type CompactMicroservice = {
  id: string;
  name: string;
  version: string;
  language: "ts" | "js";
  description: string;
  basePath: string;

  services: CompactService[];
  classes: CompactClass[];
  plugins: CompactPlugin[];

  type: "microservice" | "plugin";
};

// Compact Services

export type CompactServiceBase = {
  id: string;
  name: string;
};

export type CompactLocalService = CompactServiceBase & {
  type: "LOCAL";
  functions: CompactFunction[];
  dependencies: string[];
};

export type CompactController = CompactServiceBase & {
  type: "CONTROLLER";
  basePath: string;
  functions: CompactFunction[];
  dependencies: string[];
};

export type CompactApiIntegration = Omit<CompactController, "type"> & {
  type: "API_INTEGRATION";
  host: string;
};

export type CompactRemoteProxy = CompactServiceBase & {
  microserviceId: string;
  type: "REMOTE_PROXY";
};

export type CompactPlugableService = CompactServiceBase & {
  microserviceId: string;
  type: "PLUGABLE_SERVICE";
  plugin: string;
};

export type CompactService =
  | CompactLocalService
  | CompactController
  | CompactApiIntegration
  | CompactRemoteProxy
  | CompactPlugableService;

export type CompactFunction = {
  id: string;
  name: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  route?: string;
  params: CompactFunctionParameter[];
  returnType: string;
  returnsCollection: boolean;
};

export type CompactFunctionParameter = {
  id: string;
  name: string;
  type: string;
  isCollection: boolean;
  isOptional: boolean;
  source?: "QUERY" | "PATH" | "BODY";
};

// Compact Classes
export type CompactClass = {
  id: string;
  microserviceId: string;
  name: string;
  attributes: CompactClassAttribute[];
};

export type CompactClassAttribute = {
  id: string;
  name: string;
  type: string;
  isCollection: boolean;
  isOptional: boolean;
};

// Compact Plugins

export type CompactPlugin = {
  name: string;
  version: string;
};
