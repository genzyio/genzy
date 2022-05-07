export { Application, Request, Response, NextFunction } from "express";
import { Application, NextFunction } from "express";
import { Nimble } from 'nimbly-client';
export { Nimble, Service, Get, Post, Put, Delete, Patch } from 'nimbly-client';

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