import {
  BASIC_TYPES,
  GenericType,
  defaultTypeOptions,
  defaultParamOptions,
} from "./constants";
import type {
  ActionConfig,
  BasicType,
  BodyDecoratorOptions,
  ComplexType,
  ComplexTypeReference,
  HTTPMethod,
  Param,
  ParamDecoratorOptions,
  ParamSource,
  TypeDecoratorOptions,
} from "./types";

export function Controller(path: string = "/", rootTypeClass?: new () => any) {
  return function (target: any): void {
    if (!target.prototype.$nimbly_config) target.prototype.$nimbly_config = {};
    target.prototype.$nimbly_config = JSON.parse(
      JSON.stringify(target.prototype.$nimbly_config)
    );
    target.prototype.$nimbly_config.path = path;

    if (rootTypeClass) {
      const rootTypeInstance = new rootTypeClass();
      const rootTypeName =
        rootTypeInstance.constructor.name || rootTypeInstance._class_name_;

      if (!target.prototype.$nimbly_config.types) {
        target.prototype.$nimbly_config.types = {};
      }
      registerType(target.prototype, {
        $typeName: rootTypeName,
        ...(rootTypeInstance.$nimbly_config?.types ?? {}),
      });

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
            "$typeName" in param.type &&
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

const typeDecorator =
  (
    typeParam: string | { new (): any },
    typeKey: "result" | "type" = "type",
    isArray: boolean = false,
    options?: TypeDecoratorOptions
  ) =>
  (target: any, propertyKey?: string | symbol, parameterIndex?: any) => {
    let type = typeParam;

    options = {
      ...defaultTypeOptions,
      ...(options ?? {}),
    };

    let typeName = "";
    let typeProps = {};

    const isComplex = typeof type === "function";

    if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
    target.$nimbly_config = JSON.parse(JSON.stringify(target.$nimbly_config));
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
        // TODO: check if type is complex and register it - otherwise add it as basic type (ex. line 132)
        if (type && isComplex) {
          target.$nimbly_config.actions[propertyKey].result = type;
          registerType(target, { ...(type as any), ...typeProps } as any);
        } else {
          target.$nimbly_config.actions[propertyKey].result = {
            type,
            $isArray: isArray,
          };
        }
      } else {
        // if it's a decorator for class prop
        if (!target.$nimbly_config.types) {
          target.$nimbly_config.types = {};
        }
        target.$nimbly_config.types[propertyKey] = isComplex
          ? {
              ...(type as any),
              ...typeProps,
            }
          : { type, $isOptional: options.optional, $isArray: isArray };
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
        (p: any) => p.index === parameterIndex
      );
      const typeForParam = isComplex
        ? { ...(type as any), $isOptional: options.optional }
        : { type, $isOptional: options.optional, $isArray: isArray };
      if (existingIndex !== -1) {
        params[existingIndex] = {
          ...params[existingIndex],
          type: typeForParam,
        };
      } else {
        params.splice(parameterIndex, 0, {
          type: typeForParam,
          index: parameterIndex,
        } as any);
      }
      params.sort((a: any, b: any) => a.index - b.index);

      registerType(target, { ...(type as any), ...typeProps } as any);
    }
  };

function isTypeComplex(type: object) {
  return Object.keys(type).includes("$typeName");
}

function registerType(target: any, type: ComplexType) {
  const typeName = type.$typeName;
  const typeProps = {};

  Object.keys(type).forEach((propName) => {
    if (propName.startsWith("$")) return;
    if (isTypeComplex(type[propName])) {
      const complexType = type[propName] as any as ComplexType;
      const { $isArray, $typeName } = complexType;
      typeProps[propName] = { $isArray, $typeName };
      registerType(target, complexType);
    } else {
      typeProps[propName] = type[propName];
    }
  });

  if (isTypeComplex(type) && type.$typeName !== GenericType.name) {
    target.$nimbly_config.types = {
      ...(target.$nimbly_config.types ?? {}),
      [typeName]: typeProps,
    };
  }
}

export const string = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.string, "type", false, options);

export const boolean = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.boolean, "type", false, options);

export const int = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.int, "type", false, options);

export const float = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.float, "type", false, options);

export const stringArray = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.string, "type", true, options);

export const booleanArray = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.boolean, "type", true, options);

export const intArray = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.int, "type", true, options);

export const floatArray = (options?: TypeDecoratorOptions) =>
  typeDecorator(BASIC_TYPES.float, "type", true, options);

export const type = (type: { new (): any }, options?: TypeDecoratorOptions) =>
  typeDecorator(type, "type", false, options);

export const arrayOf = (
  type: { new (): any } | BasicType["type"],
  options?: TypeDecoratorOptions
) => typeDecorator(type, "type", true, options);

export const Returns = (type: { new (): any } | BasicType["type"]) =>
  typeDecorator(type, "result");
export const ReturnsArrayOf = (type: { new (): any } | BasicType["type"]) =>
  typeDecorator(type, "result", true);

export const Query = (name: string, options?: ParamDecoratorOptions) =>
  // optional by default
  paramDecorator("query", name, {
    ...(options ?? {}),
    optional:
      typeof options?.optional !== "undefined" ? options.optional : true,
  });

export const Path = (
  name: string,
  options?: Omit<ParamDecoratorOptions, "optional">
) => paramDecorator("path", name, options);

export const Body = function (
  options?: BodyDecoratorOptions
): (target: any, propertyKey: string | symbol, parameterIndex: number) => void {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) => {
    paramDecorator("body", undefined, options as any)(
      target,
      propertyKey,
      parameterIndex
    );
    if (options?.type) {
      typeDecorator(
        "type" in options.type ? options.type.type : options.type,
        "type",
        false,
        {
          optional: options.optional,
        }
      )(target, propertyKey, parameterIndex);
    }
  };
};

function paramDecorator(
  source: ParamSource,
  name?: string,
  options?: ParamDecoratorOptions
) {
  return function (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    options = {
      ...defaultParamOptions,
      ...(options ?? {}),
    };

    if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
    if (!target.$nimbly_config.actions[propertyKey]) {
      target.$nimbly_config.actions[propertyKey] = {};
    }
    if (!target.$nimbly_config.actions[propertyKey].params) {
      target.$nimbly_config.actions[propertyKey].params = [];
    }
    target.$nimbly_config = JSON.parse(JSON.stringify(target.$nimbly_config));
    const params: Param[] = target.$nimbly_config.actions[propertyKey].params;
    if (source === "body") {
      const index = params.findIndex((p) => p.source === "body");
      if (index > -1) {
        params.splice(index, 1);
      }
    }
    const existingIndex = params.findIndex(
      (p: any) => p.index === parameterIndex
    );
    const typeObject = {} as any;
    if (options.type !== undefined) {
      typeObject.type = options.type;
    }
    if (options.optional !== undefined) {
      typeObject.$isOptional = options.optional;
    }
    if (options.array !== undefined) {
      typeObject.$isArray = options.array;
    }
    if (existingIndex !== -1) {
      params[existingIndex] = {
        type: { ...params[existingIndex].type, ...typeObject },
        ...params[existingIndex],
        name: name ?? "",
        source,
      };
    } else {
      params.splice(parameterIndex, 0, {
        name,
        source,
        type: typeObject,
        index: parameterIndex,
      } as any);
    }
    params.sort((a: any, b: any) => a.index - b.index);
  };
}

const pathDecorator = (
  path: string,
  httpMethod: HTTPMethod,
  body: boolean = false
) =>
  function (target: any, propertyKey: string): void {
    if (!target.$nimbly_config) target.$nimbly_config = { actions: {} };
    if (!target.$nimbly_config.actions[propertyKey]) {
      target.$nimbly_config.actions[propertyKey] = {};
    }
    target.$nimbly_config = JSON.parse(JSON.stringify(target.$nimbly_config));
    const existing = target.$nimbly_config.actions[propertyKey];
    const existingParams = existing.params ?? [];
    if (body) {
      const bodyParam = existingParams.find(
        (p) => p.source === "body" || typeof p.type === "object"
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
