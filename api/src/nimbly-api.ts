import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { Nimble } from "@n1mbly/client";
import { RegisterRoutesFor } from "./routes-handler";
import {
  CustomInterceptors,
  Interceptable,
  ServiceMetaInfo,
} from "../../shared/types";
import { ErrorRegistry } from "./error-handler";
import { generateDocsFrom } from "./docs";

type InterceptorCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export type NimblyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
};
export class NimblyApi extends Interceptable<InterceptorCallback> {
  private app: Application;
  private errorRegistry: ErrorRegistry = {};
  private nimblyInfo?: NimblyInfo;
  private meta: ServiceMetaInfo[] = [];

  constructor({
    app,
    nimblyInfo,
    basePath = "/api",
  }: {
    app?: Application;
    nimblyInfo?: Omit<NimblyInfo, "basePath">;
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

  public from(...nimbles: Nimble[]): Application {
    nimbles.forEach((nimble) => {
      const serviceRegistry = nimble.getAllServices();
      Object.keys(serviceRegistry).forEach((serviceKey) => {
        const serviceMeta = RegisterRoutesFor(
          serviceRegistry[serviceKey],
          this.app,
          this.interceptors,
          this.errorRegistry,
          this.nimblyInfo.basePath
        );
        this.meta.push(serviceMeta);
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
  ): NimblyApi {
    this.interceptCustom(customInterceptors, "beforeCustomInterceptors");
    return this;
  }

  public interceptAfter(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): NimblyApi {
    this.interceptCustom(customInterceptors, "afterCustomInterceptors");
    return this;
  }

  public interceptAll(callback: InterceptorCallback): NimblyApi {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllAfter(callback: InterceptorCallback): NimblyApi {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public withErrors(errors: ErrorRegistry): NimblyApi {
    this.errorRegistry = { ...this.errorRegistry, ...errors };
    return this;
  }
}
