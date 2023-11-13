export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;
type HTTPMethod = keyof typeof HTTP_METHOD;

export const PARAM_SOURCE = {
  PATH: "path",
  QUERY: "query",
  BODY: "body",
} as const;
type ParamSource = keyof typeof PARAM_SOURCE;

export const SERVICE_TYPE = {
  LOCAL: "L",
  REMOTE_PROXY: "RP",
  CONTROLLER: "C",
  PLUGABLE_SERVICE: "PS",
  API_INTEGRATION: "API",
} as const;

export const SERVICE_TYPE_DISPLAY_NAME = {
  LOCAL: "Local Service",
  REMOTE_PROXY: "Remote Proxy",
  CONTROLLER: "Controller",
  PLUGABLE_SERVICE: "Plugable Service",
  API_INTEGRATION: "API Integration",
} as const;

type ServiceType = keyof typeof SERVICE_TYPE;

type Parameter = {
  name: string;
  type: string;
  isCollection: boolean;
  isOptional: boolean;
  source: ParamSource;
  id: string;
};

type ServiceFunction = {
  name: string;
  returnType: string;
  returnsCollection: boolean;
  route: string;
  method: HTTPMethod;
  params: Parameter[];
  id: string;
};

type Service = {
  microserviceId: string;
  name: string;
  functions: ServiceFunction[];
  type: ServiceType;
  basePath: string;
  host: string;
};

export type { Service, ServiceFunction, Parameter, HTTPMethod, ParamSource, ServiceType };
