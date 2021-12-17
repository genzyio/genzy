import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as cors from "cors";
import { Application } from "express";
import { Nimble } from "nimbly-client";
import { RegisterRoutesFor } from "./routes-handler";
import { CustomInterceptors, Interceptable } from "../../shared/types";

type InterceptorCallback = (req: Request, res: Response, next: NextFunction) => any;

export class NimblyApi extends Interceptable<InterceptorCallback> {
  private app: Application;

  constructor() {
    super();
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors({ origin: "*" }));
  }

  public from(...nimbles: Nimble[]): Application {
    nimbles.forEach((nimble) => {
      const serviceRegistry = nimble.services();
      Object.keys(serviceRegistry).forEach((serviceKey) =>
        RegisterRoutesFor(
          serviceRegistry[serviceKey],
          this.app,
          this.interceptors
        )
      );
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
}
