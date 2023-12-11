// States

export type State = "ADDED" | "MODIFIED" | "REMOVED";
export type States = Record<string, State>;

export type ProjectDefinition = {
  data: ProjectDefinitionData;
  metadata: ProjectDefinitionMetadata;
};

// Data

export type ProjectDefinitionData = Record<string, Microservice>;

export type Microservice = {
  id: string;
  name: string;
  version: string;
  language: "ts" | "js";
  description: string;
  basePath: string;

  services: Service[];
  classes: Class[];
  plugins: Plugin[];
  type: "microservice" | "plugin";
};

//  Services

export type ServiceBase = {
  id: string;
  name: string;
};

export type LocalService = ServiceBase & {
  type: "LOCAL";
  functions: Function[];
  dependencies: string[];
};

export type Controller = ServiceBase & {
  type: "CONTROLLER";
  basePath: string;
  functions: Function[];
  dependencies: string[];
};

export type ApiIntegration = Omit<Controller, "type"> & {
  type: "API_INTEGRATION";
  host: string;
};

export type RemoteProxy = ServiceBase & {
  microserviceId: string;
  type: "REMOTE_PROXY";
};

export type PlugableService = ServiceBase & {
  microserviceId: string;
  type: "PLUGABLE_SERVICE";
  plugin: string;
};

export type Service = LocalService | Controller | ApiIntegration | RemoteProxy | PlugableService;

export type Function = {
  id: string;
  name: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  route?: string;
  params: FunctionParameter[];
  returnType: string;
  returnsCollection: boolean;
};

export type FunctionParameter = {
  id: string;
  name: string;
  type: string;
  isCollection: boolean;
  isOptional: boolean;
  source?: "QUERY" | "PATH" | "BODY";
};

//  Classes
export type Class = {
  id: string;
  microserviceId: string;
  name: string;
  attributes: ClassAttribute[];
};

export type ClassAttribute = {
  id: string;
  name: string;
  type: string;
  isCollection: boolean;
  isOptional: boolean;
};

//  Plugins

export type Plugin = {
  name: string;
  version: string;
};

// Metadata

export type ProjectDefinitionMetadata = {
  elements: Record<string, any>;
  viewports: Record<string, Viewport>;
};

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};
