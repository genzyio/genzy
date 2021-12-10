import * as express from "express";
import * as cors from "cors";
import { Application } from "express";
import { Nimble } from "nimbly-client";
import {
  CustomInterceptors,
  ExpressCallback,
  getMethodsOfClassInstance,
  Interceptors,
  RegisterRoutesFor,
} from "./routes-handler";

export function upperFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type CustomInterceptorsKey = 'beforeCustomInterceptors' | 'afterCustomInterceptors';

export class NimblyApi {
  private app: Application;
  private interceptors: Interceptors = {
    beforeInterceptors: [],
    afterInterceptors: [],
    beforeCustomInterceptors: {},
    afterCustomInterceptors: {},
  };

  constructor() {
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

  public intercept(customInterceptors: CustomInterceptors): NimblyApi {
    this.interceptCustom(customInterceptors, 'beforeCustomInterceptors');
    return this;
  }

  public interceptAfter(customInterceptors: CustomInterceptors): NimblyApi {
    this.interceptCustom(customInterceptors, 'afterCustomInterceptors');
    return this;
  }

  public interceptAll(callback: ExpressCallback): NimblyApi {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllAfter(callback: ExpressCallback): NimblyApi {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  private interceptCustom(customInterceptors: CustomInterceptors, customInterceptorsKey: CustomInterceptorsKey): NimblyApi {
    Object.keys(customInterceptors).forEach((classK) => {
      const classKey = upperFirstLetter(classK);
      if (!this.interceptors[customInterceptorsKey][classKey]) {
        this.interceptors[customInterceptorsKey][classKey] = {};
      }
      const referenceObject =
        typeof customInterceptors[classK] !== "function"
          ? customInterceptors[classK]
          : new (customInterceptors[classK] as any)();
      const methodKeys: string[] =
        typeof customInterceptors[classK] !== "function"
          ? Object.keys(referenceObject)
          : (getMethodsOfClassInstance(referenceObject) as any);
      methodKeys.forEach((methodKey) => {
        if (!this.interceptors[customInterceptorsKey][classKey][methodKey]) {
          this.interceptors[customInterceptorsKey][classKey][methodKey] = [];
        }
        this.interceptors[customInterceptorsKey][classKey][methodKey].push(
          referenceObject[methodKey]
        );
      });
    });
    return this;
  }
}
