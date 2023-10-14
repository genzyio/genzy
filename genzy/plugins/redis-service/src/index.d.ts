export { Application, Request, Response, NextFunction } from "express";
import {
  N1mblyPlugin,
  N1mblyConfig,
  ServiceMetaInfo,
  MetaTypesRegistry,
  N1mblyPluginParams,
  N1mblyContainer,
} from "@n1mbly/api";

export class Plugin extends N1mblyPlugin {
  constructor(params?: { containers?: N1mblyContainer[] });

  beforeAll(params: N1mblyPluginParams): void | Promise<void>;
  beforeRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
    }
  ): void | Promise<void>;
  afterRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
      meta: ServiceMetaInfo & { types: MetaTypesRegistry };
    }
  ): void | Promise<void>;
  afterAll(params: N1mblyPluginParams): void | Promise<void>;
}

export class RedisService {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<string>;
  delete(key: string): Promise<string>;
}
