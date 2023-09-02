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
  type MetaInfo,
  type N1mblyInfo,
} from "../../shared/types";
import { ErrorRegistry } from "./error-handler";
import { generateDocsFrom } from "./docs";

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

  public buildAppFrom(...containers: N1mblyContainer[]): Application {
    containers.forEach((nimble) => {
      const serviceRegistry = nimble.getServices();
      Object.keys(serviceRegistry).forEach((serviceKey) => {
        const { service } = RegisterRoutesFor(
          serviceRegistry[serviceKey],
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
