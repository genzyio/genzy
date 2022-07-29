export { Application, Request, Response, NextFunction } from "express";
import { Application, NextFunction } from "express";
import { Nimble } from 'nimbly-client';
export { Nimble, Controller, Get, Post, Put, Delete, Patch, Query, Path, Body } from 'nimbly-client';

type InterceptorCallback = (req: Request, res: Response, next: NextFunction) => any;

type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback
  }
};

type ErrorRegistry = { [key: string]: number };

type NimblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
}

interface Constructor {
  new (...args: any[]);
}

export class NimblyApi {
  constructor();
  constructor(options: {app?: Application, nimblyInfo?: NimblyInfo, basePath?: string});

  public intercept(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi;
  public interceptAfter(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi;
  public interceptAll(callback: InterceptorCallback): NimblyApi;
  public interceptAllAfter(callback: InterceptorCallback): NimblyApi;
  public withErrors(errors: ErrorRegistry): NimblyApi;
  public from(...nimbles: Nimble[]): Application;
}

export function string(target: any, propertyKey?: string | symbol, parameterIndex?: any): void;
export function boolean(target: any, propertyKey?: string | symbol, parameterIndex?: any): void;
export function int(target: any, propertyKey?: string | symbol, parameterIndex?: any): void;
export function float(target: any, propertyKey?: string | symbol, parameterIndex?: any): void;
export function type(type: Constructor): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function arrayOf(type: Constructor): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Returns(type: Constructor): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function ReturnsArrayOf(type: Constructor): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;