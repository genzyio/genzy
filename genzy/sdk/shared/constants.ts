import { ParamDecoratorOptions, TypeDecoratorOptions } from "./types";

export class GenericType {}

export const BUILT_IN_METHODS = [
  "constructor",
  "__defineGetter__",
  "__defineSetter__",
  "hasOwnProperty",
  "__lookupGetter__",
  "__lookupSetter__",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "toLocaleString",
  "$genzyInterceptors",
  "$genzyOrigin",
];

export const BUILT_IN_PROPS = [
  "_class_name_",
  "$genzyInterceptors",
  "$genzyOrigin",
  "genzyConfig",
  "genzy_config",
  "$genzy_config",
  "genzy_config",
  "$genzy_config",
  "$genzy",
  "$genzyType",
  "nodeType",
  "hasAttribute",
  "tagName",
  "prototype",
];

export const PREFIX_TO_METHOD_REG = {
  get: "get",
  read: "get",
  fetch: "get",
  add: "post",
  create: "post",
  post: "post",
  put: "put",
  update: "put",
  delete: "delete",
  remove: "delete",
};

export const METHOD_TO_HAS_BODY = {
  get: false,
  GET: false,
  post: true,
  POST: true,
  put: true,
  PUT: true,
  delete: false,
  DELETE: false,
  patch: true,
  PATCH: true,
};

export const MatchPathParamsRegex = /(?<=\/:).*?(?=(\/|$))/g;

export const BASIC_TYPES = {
  string: "string",
  boolean: "boolean",
  int: "int",
  float: "float",
} as const;

export const defaultTypeOptions: TypeDecoratorOptions = {
  optional: false,
};

export const defaultParamOptions: ParamDecoratorOptions = {
  optional: false,
};
