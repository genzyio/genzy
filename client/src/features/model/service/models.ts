export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;
type HTTPMethod = keyof typeof HTTP_METHOD;

export const PARAM_SOURCE = {
  BODY: "body",
  PATH: "path",
  QUERY: "query",
} as const;
type ParamSource = keyof typeof PARAM_SOURCE;

export const SERVICE_TYPE = {
  LOCAL: "L",
  REMOTE_PROXY: "RP",
  CONTROLLER: "C",
} as const;
type ServiceType = keyof typeof SERVICE_TYPE;

type Parameter = {
  name: string;
  type: string;
  isCollection: boolean;
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
  name: string;
  functions: ServiceFunction[];
  type: ServiceType;
};

export type { Service, ServiceFunction, Parameter, HTTPMethod, ParamSource, ServiceType };
