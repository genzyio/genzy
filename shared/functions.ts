import { BUILT_IN_METHODS, MatchPathParamsRegex, PREFIX_TO_METHOD_REG } from "./constants";
import { ComplexType, NimblyConfig, QueryParamDefinition, Type } from "./types";

export function lowerFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function upperFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function camelToDashCase(key) {
  var result = key.replace(/([A-Z])/g, " $1" );
  return result.split(' ').join('-').toLowerCase().replace(/^-/g, '');
}

export function getHttpMethod(fname) {
  const match = Object.keys(PREFIX_TO_METHOD_REG).find(prefix => fname.match(new RegExp(`^${prefix}`, 'g')));
  return PREFIX_TO_METHOD_REG[match] || 'post';
}

export function getMethodsOfClassInstance(obj: any): string[] {
  const properties = new Set<string>()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter((item: string) => !BUILT_IN_METHODS.includes(item) && typeof obj[item] === 'function') as string[];
}

export function getResourcePath(cname, fname) {
  return `${camelToDashCase(cname)}/${camelToDashCase(fname)}`;
}

export function extractPathParamsFrom(fullRoutePath: string) {
  return [...fullRoutePath.matchAll(MatchPathParamsRegex)].map(r => r[0]);
}

export function combineNimblyConfigs(nimbly: NimblyConfig, nimbly_config: NimblyConfig): NimblyConfig {
  return {...(nimbly_config ?? {}), ...(nimbly ?? {})};
}

export function getPathParamTypes(pathParams: string[], queryParamDefinitions: QueryParamDefinition[], methodParamTypes: Type[]): Type[] {
  return methodParamTypes.filter((_, i) => !queryParamDefinitions.find(e => e.index === i))
    .filter((_, i) => pathParams[i])
    .map(type => type);
}

export function getBodyType(methodParamTypes: Type[]): ComplexType {
  const objectMethodParamType: any = methodParamTypes.find(type => typeof type === "object");
  return objectMethodParamType ?? null;
}