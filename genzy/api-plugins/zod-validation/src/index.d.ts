export { Application, Request, Response, NextFunction } from "express";
import {
  GenzyPlugin,
  GenzyConfig,
  ServiceMetaInfo,
  MetaTypesRegistry,
  GenzyPluginParams,
  GenzyContainer,
} from "@genzy.io/api";

export class Plugin extends GenzyPlugin {
  constructor(params?: { containers?: GenzyContainer[] });

  beforeAll(params: GenzyPluginParams): void | Promise<void>;
  beforeRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
    }
  ): void | Promise<void>;
  afterRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
      meta: ServiceMetaInfo & { types: MetaTypesRegistry };
    }
  ): void | Promise<void>;
  afterAll(params: GenzyPluginParams): void | Promise<void>;
}
