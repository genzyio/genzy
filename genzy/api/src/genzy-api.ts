import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { GenzyContainer } from "../../client";
import { RegisterRoutesFor } from "./routes-handler";
import {
  CustomInterceptors,
  Interceptable,
  type GenzyConfig,
  type MetaInfo,
  type GenzyInfo,
  type ServiceMetaInfo,
} from "../../shared/types";
import { ErrorRegistry } from "./error-handler";
import { generateDocsFrom } from "./docs";
import { combineGenzyConfigs } from "../../shared/functions";

type GenzyPluginParams = {
  genzyApi: GenzyApi;
  app: Application;
};

export abstract class GenzyPlugin {
  constructor(params?: { containers?: GenzyContainer[] }) {}

  beforeAll(params: GenzyPluginParams): Promise<void> | void {}
  beforeRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
    }
  ): Promise<void> | void {}
  afterRouteRegister(
    params: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
      meta: ServiceMetaInfo & { types: MetaInfo["types"] };
    }
  ): Promise<void> | void {}
  afterAll(params: GenzyPluginParams): Promise<void> | void {}
}

type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export class GenzyApi extends Interceptable<InterceptorCallback> {
  private app: Application;
  private errorRegistry: ErrorRegistry = {};
  private genzyInfo?: GenzyInfo;
  private meta: MetaInfo = {
    services: [],
    types: {},
  };
  private plugins: GenzyPlugin[] = [];

  constructor({
    app,
    genzyInfo,
    basePath = "/api",
  }: {
    app?: Application;
    genzyInfo?: Omit<GenzyInfo, "basePath">;
    basePath?: string;
  } = {}) {
    super();
    this.genzyInfo = !!genzyInfo ? { basePath, ...genzyInfo } : { basePath };
    if (!app) {
      this.app = express();
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());
      this.app.use(cors({ origin: "*" }));
    } else {
      this.app = app;
    }
    this.meta.genzyInfo = this.genzyInfo;
  }

  public addPlugin(plugin: GenzyPlugin): GenzyApi {
    this.plugins.push(plugin);
    return this;
  }

  public buildAppFrom(...containers: GenzyContainer[]): Application {
    // BEFORE ALL
    this.plugins.forEach((plugin) => {
      plugin.beforeAll({ genzyApi: this, app: this.app });
    });

    containers.forEach((container) => {
      const serviceRegistry = container.getServices();
      Object.keys(serviceRegistry)
        .filter((x) => !x.startsWith("$"))
        .forEach((serviceKey) => {
          const instance = serviceRegistry[serviceKey];

          // BEFORE ROUTE REGISTER
          this.plugins.forEach((plugin) => {
            plugin.beforeRouteRegister({
              genzyApi: this,
              app: this.app,
              serviceKey,
              serviceInstance: instance,
              genzyConfig: combineGenzyConfigs(
                instance?.$genzy_config ?? {},
                instance?.$genzy ?? {}
              ),
            });
          });

          const { service } = RegisterRoutesFor(
            instance,
            this.app,
            this.interceptors,
            this.errorRegistry,
            this.genzyInfo.basePath
          );
          const { types, ...serviceMeta } = service;
          // register service
          this.meta.services.push(serviceMeta);
          // register type
          this.meta.types = {
            ...this.meta.types,
            ...types,
            // TODO: handle name conflicts
          };

          // AFTER ROUTE REGISTER
          this.plugins.forEach((plugin) => {
            plugin.afterRouteRegister({
              genzyApi: this,
              app: this.app,
              serviceKey,
              serviceInstance: instance,
              genzyConfig: combineGenzyConfigs(
                instance?.$genzy_config ?? {},
                instance?.$genzy ?? {}
              ),
              meta: service,
            });
          });
        });
    });

    this.app.get(`${this.genzyInfo.basePath}/meta`, (_, res) => {
      res.status(200).send(this.meta);
    });

    const options = {
      explorer: true,
      swaggerOptions: {
        url: `${this.genzyInfo.basePath}/swagger.json`,
      },
    };
    const swaggerDocument = generateDocsFrom(this.meta, this.genzyInfo);
    this.app.get(options.swaggerOptions.url, (req, res) =>
      res.json(swaggerDocument)
    );
    this.app.use(
      "/explorer",
      express.static("node_modules/swagger-ui-dist/", { index: false }),
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, options)
    );

    // AFTER ALL
    this.plugins.forEach((plugin) => {
      plugin.afterAll({ genzyApi: this, app: this.app });
    });

    return this.app;
  }

  public intercept(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyApi {
    this.interceptCustom(customInterceptors, "beforeCustomInterceptors");
    return this;
  }

  public interceptAfter(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyApi {
    this.interceptCustom(customInterceptors, "afterCustomInterceptors");
    return this;
  }

  public interceptAll(callback: InterceptorCallback): GenzyApi {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllAfter(callback: InterceptorCallback): GenzyApi {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public withErrors(errors: ErrorRegistry): GenzyApi {
    this.errorRegistry = { ...this.errorRegistry, ...errors };
    return this;
  }
}
