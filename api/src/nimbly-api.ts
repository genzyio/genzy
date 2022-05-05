import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";
import { Application } from "express";
import { Nimble } from "nimbly-client";
import { RegisterRoutesFor } from "./routes-handler";
import { CustomInterceptors, Interceptable, ServiceMetaInfo } from "../../shared/types";
import { ErrorRegistry } from "./error-handler";

type InterceptorCallback = (req: Request, res: Response, next: NextFunction) => any;

export class NimblyApi extends Interceptable<InterceptorCallback> {
  private app: Application;
  private errorRegistry: ErrorRegistry = {};
  private meta: ServiceMetaInfo[] = [];

  constructor(app?: Application) {
    super();
    if(!app) {
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
      const serviceRegistry = nimble.services();
      Object.keys(serviceRegistry).forEach((serviceKey) => {
        const serviceMeta = RegisterRoutesFor(
          serviceRegistry[serviceKey],
          this.app,
          this.interceptors,
          this.errorRegistry
        );
        this.meta.push(serviceMeta);
      });
    });

    this.app.get('/api/meta', (_, res) => {
      res.status(200).send(this.meta);
    });

    return this.app;
  }

  public intercept(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi {
    this.interceptCustom(customInterceptors, 'beforeCustomInterceptors');
    return this;
  }

  public interceptAfter(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi {
    this.interceptCustom(customInterceptors, 'afterCustomInterceptors');
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
    this.errorRegistry = {...this.errorRegistry, ...errors};
    return this;
  }
}
