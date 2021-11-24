import * as express from "express";
import * as cors from 'cors';
import { Application } from "express";
import { Nimble } from "nimbly-client";
import { RegisterRoutesFor } from "./routes-handler";

export class NimblyApi {
  private app: Application;

  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors({origin: '*'}));
  }

  public from(...nimbles: Nimble[]): Application {
    nimbles.forEach((nimble) => {
      const serviceRegistry = nimble.services();
      Object.keys(serviceRegistry).forEach((serviceKey) =>
        RegisterRoutesFor(serviceRegistry[serviceKey], this.app)
      )
    });
    return this.app;
  }
}
