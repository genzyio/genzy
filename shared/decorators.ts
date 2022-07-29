import { BASIC_TYPES } from "./constants";
import { HTTPMethod, Param, ParamSource } from "./types";

export function Controller(path: string = '/') {
  return function (target: any): void {
    if(!target.prototype.$nimbly_config) target.prototype.$nimbly_config = {};
    target.prototype.$nimbly_config.path = path;
  }
}

export function Get(path: string = '') {
  return pathDecorator(path, 'GET');
}

export function Post(path: string = '') {
  return pathDecorator(path, 'POST', true);
}

export function Put(path: string = '') {
  return pathDecorator(path, 'PUT', true);
}

export function Delete(path: string = '') {
  return pathDecorator(path, 'DELETE');
}

export function Patch(path: string = '') {
  return pathDecorator(path, 'PATCH', true);
}

const typeDecorator = (
  typeParam: string | { new(): any },
  typeKey: 'result'|'type' = 'type',
  isArray: boolean = false
) => (target: any, propertyKey?: string | symbol, parameterIndex?: any) => {
  let type = typeParam;
  if(!target.$nimbly_config) target.$nimbly_config = {};
  if(typeof type === 'function') {
    const instance = new type();
    const typeName = instance.constructor.name || instance._class_name_;
    type = {...instance.$nimbly_config.types};
    (type as any).$isArray = isArray;
    (type as any).$typeName = typeName;
  }
  if(!propertyKey) return;
  if(parameterIndex === undefined || typeof parameterIndex !== 'number') {
    if(typeKey === 'result') {
      if(!target.$nimbly_config[propertyKey]) {
        target.$nimbly_config[propertyKey] = {};
      }
      target.$nimbly_config[propertyKey].result = type;
    } else {
      if(!target.$nimbly_config.types) target.$nimbly_config.types = {};
      target.$nimbly_config.types[propertyKey] = type;
    }
  } else {
    if(!target.$nimbly_config[propertyKey]) target.$nimbly_config[propertyKey] = {};
    if(!target.$nimbly_config[propertyKey].params) target.$nimbly_config[propertyKey].params = [];
    const params: Param[] = target.$nimbly_config[propertyKey].params;
    const existingIndex = params.findIndex((p: any) => p.index === parameterIndex);
    if(existingIndex !== -1) {
      params[existingIndex] = { ...params[existingIndex], type: type as any };
    } else {
      params.splice(parameterIndex, 0, { type, index: parameterIndex } as any);
    }
    params.sort((a: any, b: any) => a.index - b.index);
  }
}

export const string = typeDecorator(BASIC_TYPES.string);
export const boolean = typeDecorator(BASIC_TYPES.boolean);
export const int = typeDecorator(BASIC_TYPES.int);
export const float = typeDecorator(BASIC_TYPES.float);
export const type = (type: { new(): any }) => typeDecorator(type);
export const arrayOf = (type: { new(): any }) => typeDecorator(type, 'type', true);

export const Returns = (type: { new(): any }) => typeDecorator(type, 'result');
export const ReturnsArrayOf = (type: { new(): any }) => typeDecorator(type, 'result', true);

export const Query = (name: string) => paramDecorator('query', name);
export const Path = (name: string) => paramDecorator('path', name);
export const Body = () => paramDecorator('body');

function paramDecorator(source: ParamSource, name?: string) {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    if(!target.$nimbly_config) target.$nimbly_config = {};
    if(!target.$nimbly_config[propertyKey]) target.$nimbly_config[propertyKey] = {};
    if(!target.$nimbly_config[propertyKey].params) target.$nimbly_config[propertyKey].params = [];
    const params: Param[] = target.$nimbly_config[propertyKey].params;
    if(source === 'body') {
      const index = params.findIndex(p => p.source === 'body');
      if (index > -1) {
        params.splice(index, 1);
      }
    }
    const existingIndex = params.findIndex((p: any) => p.index === parameterIndex);
    if(existingIndex !== -1) {
      params[existingIndex] = { ...params[existingIndex], name: name ?? '', source };
    } else {
      params.splice(parameterIndex, 0, { name, source, index: parameterIndex } as any);
    }
    params.sort((a: any, b: any) => a.index - b.index);
  }
}

const pathDecorator = (path: string, httpMethod: HTTPMethod, body: boolean = false) => function (target: any, propertyKey: string): void {
  if(!target.$nimbly_config) target.$nimbly_config = {};
  if(!target.$nimbly_config[propertyKey]) target.$nimbly_config[propertyKey] = {};
  const existing = target.$nimbly_config[propertyKey];
  const existingParams = existing.params ?? [];
  if (body) {
    const bodyParam = existingParams.find(p => p.source === "body" || typeof p.type === 'object');
    if(!bodyParam) {
      existingParams.push({ name: 'body', source: 'body' });
    } else {
      if(!bodyParam.name) bodyParam.name = 'body';
      if(!bodyParam.source) bodyParam.source = 'body';
    }
  }
  target.$nimbly_config[propertyKey] = {
    ...existing,
    path: path.replace('\/\/', '/'),
    httpMethod,
    params: existingParams,
  };
}