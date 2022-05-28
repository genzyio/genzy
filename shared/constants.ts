export const BUILT_IN_METHODS = [
  'constructor',
  '__defineGetter__',
  '__defineSetter__',
  'hasOwnProperty',
  '__lookupGetter__',
  '__lookupSetter__',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString',
  '$nimblyInterceptors',
  '$nimblyOrigin',
];

export const PREFIX_TO_METHOD_REG = {
  get: 'get',
  read: 'get',
  fetch: 'get',
  add: 'post',
  create: 'post',
  post: 'post',
  put: 'put',
  update: 'put',
  delete: 'delete',
  remove: 'delete',
}

export const MatchPathParamsRegex = /(?<=\/:).*?(?=(\/|$))/g;

export const BASIC_TYPES = {
  string: 'string',
  boolean: 'boolean',
  int: 'int',
  float: 'float',
}