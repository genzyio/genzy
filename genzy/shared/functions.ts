import {
  BUILT_IN_METHODS,
  MatchPathParamsRegex,
  METHOD_TO_HAS_BODY,
  PREFIX_TO_METHOD_REG,
} from "./constants";
import {
  Action,
  GenzyConfig,
  Param,
  ParamSource,
  ServiceMetaInfo,
} from "./types";

export function lowerFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function upperFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function camelToKebabCase(key) {
  var result = key.replace(/([A-Z])/g, " $1");
  return result.split(" ").join("-").toLowerCase().replace(/^-/g, "");
}

export function getHttpMethod(fname) {
  const match = Object.keys(PREFIX_TO_METHOD_REG).find((prefix) =>
    fname.match(new RegExp(`^${prefix}`, "g"))
  );
  return PREFIX_TO_METHOD_REG[match] || "post";
}

export function getMethodsOfClassInstance(obj: any): string[] {
  const properties = new Set<string>();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item: string) =>
      !BUILT_IN_METHODS.includes(item) && typeof obj[item] === "function"
  ) as string[];
}

export function getResourcePath(cname, fname) {
  return `${camelToKebabCase(cname)}/${camelToKebabCase(fname)}`;
}

export function formParamsOf(
  methodName: string,
  action: Action | undefined
): Param[] {
  const params: Param[] = [...(action?.params ?? ([] as any))];
  if (params.filter((p) => p.source === "path").length === 0) {
    const pathParamNames = extractPathParamsFrom(action?.path ?? "");
    params.unshift(
      ...pathParamNames
        .filter((name) => !params.find((p) => p.name === name))
        .map((name) => ({ name, source: "path" as ParamSource }))
    );
  }
  if (
    METHOD_TO_HAS_BODY[action?.httpMethod ?? getHttpMethod(methodName)] &&
    !params.find((p) => p.source === "body")
  ) {
    params.push({
      name: "body",
      source: "body",
    });
  }
  return params;
}

export function extractPathParamsFrom(fullRoutePath: string) {
  return [...fullRoutePath.matchAll(MatchPathParamsRegex)].map((r) => r[0]);
}

export function combineGenzyConfigs(
  genzy: GenzyConfig,
  genzy_config: GenzyConfig
): GenzyConfig {
  return {
    path: genzy.path ?? genzy_config.path,
    actions: {
      ...(genzy_config?.actions ?? {}),
      ...(genzy?.actions ?? {}),
    },
    types: {
      ...(genzy_config?.types ?? {}),
      ...(genzy?.types ?? {}),
    },
  };
}

export function genzyConfigFrom(
  serviceMetaInfo: ServiceMetaInfo
): GenzyConfig {
  const result: GenzyConfig = {
    path: serviceMetaInfo.path,
    actions: {},
  };
  serviceMetaInfo.actions.forEach((action) => {
    result.actions[action.name] = {
      httpMethod: action.httpMethod,
      params: action.params,
      path: action.path,
      result: action.result,
    } as Action;
  });
  return result;
}
