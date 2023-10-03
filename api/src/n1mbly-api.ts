import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { N1mblyContainer } from "@n1mbly/client";
import { RegisterRoutesFor } from "./routes-handler";
import {
  CustomInterceptors,
  Interceptable,
  type N1mblyConfig,
  type MetaInfo,
  type N1mblyInfo,
  type ServiceMetaInfo,
} from "../../shared/types";
import { ErrorRegistry } from "./error-handler";
import { generateDocsFrom } from "./docs";
import { combineN1mblyConfigs } from "../../shared/functions";

type N1mblyPluginParams = {
  n1mblyApi: N1mblyApi;
  app: Application;
};

export interface N1mblyPlugin {
  beforeAll(params: N1mblyPluginParams): Promise<void> | void;
  beforeRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
    }
  ): Promise<void> | void;
  afterRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
      meta: ServiceMetaInfo & { types: MetaInfo["types"] };
    }
  ): Promise<void> | void;
  afterAll(params: N1mblyPluginParams): Promise<void> | void;
}

type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export class N1mblyApi extends Interceptable<InterceptorCallback> {
  private app: Application;
  private errorRegistry: ErrorRegistry = {};
  private n1mblyInfo?: N1mblyInfo;
  private meta: MetaInfo = {
    services: [],
    types: {},
  };
  private plugins: N1mblyPlugin[] = [];

  constructor({
    app,
    n1mblyInfo,
    basePath = "/api",
  }: {
    app?: Application;
    n1mblyInfo?: Omit<N1mblyInfo, "basePath">;
    basePath?: string;
  } = {}) {
    super();
    this.n1mblyInfo = !!n1mblyInfo ? { basePath, ...n1mblyInfo } : { basePath };
    if (!app) {
      this.app = express();
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());
      this.app.use(cors({ origin: "*" }));
    } else {
      this.app = app;
    }
    this.meta.n1mblyInfo = this.n1mblyInfo;
  }

  public addPlugin(plugin: N1mblyPlugin): N1mblyApi {
    this.plugins.push(plugin);
    return this;
  }

  public buildAppFrom(...containers: N1mblyContainer[]): Application {
    // BEFORE ALL
    this.plugins.forEach((plugin) => {
      plugin.beforeAll({ n1mblyApi: this, app: this.app });
    });

    containers.forEach((container) => {
      const serviceRegistry = container.getServices();
      Object.keys(serviceRegistry).forEach((serviceKey) => {
        const instance = serviceRegistry[serviceKey];

        // BEFORE ROUTE REGISTER
        this.plugins.forEach((plugin) => {
          plugin.beforeRouteRegister({
            n1mblyApi: this,
            app: this.app,
            serviceKey,
            serviceInstance: instance,
            n1mblyConfig: combineN1mblyConfigs(
              instance?.$nimbly_config ?? {},
              instance?.$nimbly ?? {}
            ),
          });
        });

        const { service } = RegisterRoutesFor(
          instance,
          this.app,
          this.interceptors,
          this.errorRegistry,
          this.n1mblyInfo.basePath
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
            n1mblyApi: this,
            app: this.app,
            serviceKey,
            serviceInstance: instance,
            n1mblyConfig: combineN1mblyConfigs(
              instance?.$nimbly_config ?? {},
              instance?.$nimbly ?? {}
            ),
            meta: service,
          });
        });
      });
    });

    this.app.get(`${this.n1mblyInfo.basePath}/meta`, (_, res) => {
      res.status(200).send(this.meta);
    });

    const options = {
      explorer: true,
      swaggerOptions: {
        url: `${this.n1mblyInfo.basePath}/swagger.json`,
      },
    };
    const swaggerDocument = generateDocsFrom(this.meta, this.n1mblyInfo);
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
      plugin.afterAll({ n1mblyApi: this, app: this.app });
    });

    return this.app;
  }

  public intercept(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyApi {
    this.interceptCustom(customInterceptors, "beforeCustomInterceptors");
    return this;
  }

  public interceptAfter(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyApi {
    this.interceptCustom(customInterceptors, "afterCustomInterceptors");
    return this;
  }

  public interceptAll(callback: InterceptorCallback): N1mblyApi {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllAfter(callback: InterceptorCallback): N1mblyApi {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public withErrors(errors: ErrorRegistry): N1mblyApi {
    this.errorRegistry = { ...this.errorRegistry, ...errors };
    return this;
  }
}
