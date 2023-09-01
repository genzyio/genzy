import { BASIC_TYPES, GenericType } from "./constants";
import type {
  ActionConfig,
  ComplexTypeReference,
  HTTPMethod,
  Param,
  ParamSource,
  Type,
} from "./types";

export function Controller(path: string = "/", rootTypeClass?: new () => any) {
  return function (target: any): void {
    if (!target.prototype.$nimbly_config) target.prototype.$nimbly_config = {};
    target.prototype.$nimbly_config.path = path;

    if (rootTypeClass) {
      const rootTypeInstance = new rootTypeClass();
      const rootTypeName = rootTypeInstance.constructor.name ||
        rootTypeInstance._class_name_;

      if (!target.prototype.$nimbly_config.types) {
        target.prototype.$nimbly_config.types = {};
      }
      target.prototype.$nimbly_config.types[rootTypeName] = {
        ...(rootTypeInstance.$nimbly_config?.types ?? {}),
      };

      const actionConfig = target.prototype.$nimbly_config
        .actions as ActionConfig;
      Object.keys(actionConfig).forEach((methodName) => {
        const action = actionConfig[methodName];
        if (action.result && action.result.$typeName === GenericType.name) {
          action.result.$typeName = rootTypeName;
        }

        Object.values(action.params ?? {}).forEach((param) => {
          if (
            param.type &&
            typeof param.type === "object" &&
            (param.type as ComplexTypeReference).$typeName === GenericType.name
          ) {
            param.type.$typeName = rootTypeName;
          }
        });
      });
    }
  };
}

export function Get(path: string = "") {
  return pathDecorator(path, "GET");
}

export function Post(path: string = "") {
  return pathDecorator(path, "POST", true);
}

export function Put(path: string = "") {
  return pathDecorator(path, "PUT", true);
}

export function Delete(path: string = "") {
  return pathDecorator(path, "DELETE");
}

export function Patch(path: string = "") {
  return pathDecorator(path, "PATCH", true);
}

const typeDecorator = (
  typeParam: string | { new (): any },
  typeKey: "result" | "type" = "type",
  isArray: boolean = false,
  isOptional: boolean = false,
) =>
(target: any, propertyKey?: string | symbol, parameterIndex?: any) => {
  let type = typeParam;

  let typeName = "";
  let typeProps = {};

  const isComplex = typeof type === "function";

  if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
  if (isComplex && typeName !== GenericType.name) {
    const instance = new (type as new () => any)();
    typeName = instance.constructor.name || instance._class_name_;
    typeProps = { ...(instance.$nimbly_config?.types ?? {}) };

    (type as any) = {
      $typeName: typeName,
      $isArray: isArray,
    };
  }
  if (!propertyKey) return;
  if (parameterIndex === undefined || typeof parameterIndex !== "number") {
    if (typeKey === "result") {
      if (!target.$nimbly_config.actions[propertyKey]) {
        target.$nimbly_config.actions[propertyKey] = {};
      }
      if (type) {
        target.$nimbly_config.actions[propertyKey].result = type;
      }

      if (isComplex && typeName !== GenericType.name) {
        target.$nimbly_config.types = {
          ...(target.$nimbly_config.types ?? {}),
          [typeName]: typeProps,
        };
      }
    } else {
      // if it's a decorator for class prop
      if (!target.$nimbly_config.types) {
        target.$nimbly_config.types = {};
        //       target.$nimbly_config.types = { $optionalProperties: [] };
      }
      // if (isOptional) {
      //   target.$nimbly_config.types["$optionalProperties"].push(propertyKey);
      // }
      target.$nimbly_config.types[propertyKey] = isComplex
        ? {
          $isOptional: isOptional,
          ...(type as any),
          ...typeProps,
        }
        : { type: type, $isOptional: isOptional };
    }
  } else {
    if (!target.$nimbly_config.actions[propertyKey]) {
      target.$nimbly_config.actions[propertyKey] = {};
    }
    if (!target.$nimbly_config.actions[propertyKey].params) {
      target.$nimbly_config.actions[propertyKey].params = [];
    }
    const params: Param[] = target.$nimbly_config.actions[propertyKey].params;
    const existingIndex = params.findIndex(
      (p: any) => p.index === parameterIndex,
    );
    if (existingIndex !== -1) {
      params[existingIndex] = { ...params[existingIndex], type: type as any };
    } else {
      params.splice(parameterIndex, 0, {
        type,
        index: parameterIndex,
      } as any);
    }
    params.sort((a: any, b: any) => a.index - b.index);

    if (isComplex && typeName !== GenericType.name) {
      target.$nimbly_config.types = {
        ...(target.$nimbly_config.types ?? {}),
        [typeName]: typeProps,
      };
    }
  }
};
export const string = (optional?: boolean) =>
  typeDecorator(BASIC_TYPES.string, "type", false, optional);

export const boolean = (optional?: boolean) =>
  typeDecorator(BASIC_TYPES.boolean, "type", false, optional);

export const int = (optional?: boolean) =>
  typeDecorator(BASIC_TYPES.int, "type", false, optional);

export const float = (optional?: boolean) =>
  typeDecorator(BASIC_TYPES.float, "type", false, optional);

export const type = (type: { new (): any }) => typeDecorator(type);

export const arrayOf = (type: { new (): any }) =>
  typeDecorator(type, "type", true);

export const Returns = (type: { new (): any }) => typeDecorator(type, "result");
export const ReturnsArrayOf = (type: { new (): any }) =>
  typeDecorator(type, "result", true);

export const Query = (name: string) => paramDecorator("query", name);
export const Path = (name: string) => paramDecorator("path", name);
export const Body = function (type?: {
  new (): any;
}): (
  target: any,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) => {
    paramDecorator("body")(target, propertyKey, parameterIndex);
    if (type) {
      typeDecorator(type)(target, propertyKey, parameterIndex);
    }
  };
};

function paramDecorator(source: ParamSource, name?: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ) {
    if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
    if (!target.$nimbly_config.actions[propertyKey]) {
      target.$nimbly_config.actions[propertyKey] = {};
    }
    if (!target.$nimbly_config.actions[propertyKey].params) {
      target.$nimbly_config.actions[propertyKey].params = [];
    }
    const params: Param[] = target.$nimbly_config.actions[propertyKey].params;
    if (source === "body") {
      const index = params.findIndex((p) => p.source === "body");
      if (index > -1) {
        params.splice(index, 1);
      }
    }
    const existingIndex = params.findIndex(
      (p: any) => p.index === parameterIndex,
    );
    if (existingIndex !== -1) {
      params[existingIndex] = {
        ...params[existingIndex],
        name: name ?? "",
        source,
      };
    } else {
      params.splice(parameterIndex, 0, {
        name,
        source,
        index: parameterIndex,
      } as any);
    }
    params.sort((a: any, b: any) => a.index - b.index);
  };
}

const pathDecorator = (
  path: string,
  httpMethod: HTTPMethod,
  body: boolean = false,
) =>
  function (target: any, propertyKey: string): void {
    if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
    if (!target.$nimbly_config.actions[propertyKey]) {
      target.$nimbly_config.actions[propertyKey] = {};
    }
    const existing = target.$nimbly_config.actions[propertyKey];
    const existingParams = existing.params ?? [];
    if (body) {
      const bodyParam = existingParams.find(
        (p) => p.source === "body" || typeof p.type === "object",
      );
      if (!bodyParam) {
        existingParams.push({ name: "body", source: "body" });
      } else {
        if (!bodyParam.name) bodyParam.name = "body";
        if (!bodyParam.source) bodyParam.source = "body";
      }
    }
    target.$nimbly_config.actions[propertyKey] = {
      ...existing,
      path: path.replace("//", "/"),
      httpMethod,
      params: existingParams,
    };
  };
