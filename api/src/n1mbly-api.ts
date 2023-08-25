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
  MetaInfo,
} from "../../shared/types";
import { ErrorRegistry } from "./error-handler";
import { generateDocsFrom } from "./docs";

type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export type N1mblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
};

export class N1mblyApi extends Interceptable<InterceptorCallback> {
  private app: Application;
  private errorRegistry: ErrorRegistry = {};
  private nimblyInfo?: N1mblyInfo;
  private meta: MetaInfo = {
    services: [],
    types: {},
  };

  constructor({
    app,
    nimblyInfo,
    basePath = "/api",
  }: {
    app?: Application;
    nimblyInfo?: Omit<N1mblyInfo, "basePath">;
    basePath?: string;
  } = {}) {
    super();
    this.nimblyInfo = !!nimblyInfo ? { basePath, ...nimblyInfo } : { basePath };
    if (!app) {
      this.app = express();
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(express.json());
      this.app.use(cors({ origin: "*" }));
    } else {
      this.app = app;
    }
  }

  public buildAppFrom(...containers: N1mblyContainer[]): Application {
    containers.forEach((nimble) => {
      const serviceRegistry = nimble.getServices();
      Object.keys(serviceRegistry).forEach((serviceKey) => {
        const serviceMeta = RegisterRoutesFor(
          serviceRegistry[serviceKey],
          this.app,
          this.interceptors,
          this.errorRegistry,
          this.nimblyInfo.basePath
        );
        // register service
        this.meta.services.push(serviceMeta.service);
        // register type
        this.meta.types = {
          ...this.meta.types,
          ...serviceMeta.types,
          // TODO: handle name conflicts
        };
      });
    });

    this.app.get(`${this.nimblyInfo.basePath}/meta`, (_, res) => {
      res.status(200).send(this.meta);
    });

    const options = {
      explorer: true,
      swaggerOptions: {
        url: `${this.nimblyInfo.basePath}/swagger.json`,
      },
    };
    const swaggerDocument = generateDocsFrom(this.meta, this.nimblyInfo);
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
