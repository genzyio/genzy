export { Application, Request, Response, NextFunction } from "express";
import {
  N1mblyPlugin,
  N1mblyConfig,
  ServiceMetaInfo,
  MetaInfo,
  N1mblyApi,
  MetaTypesRegistry,
  N1mblyPluginParams,
} from "@n1mbly/api";

export class ZodValidationPlugin implements N1mblyPlugin {
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
