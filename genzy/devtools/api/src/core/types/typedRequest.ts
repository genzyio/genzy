import { type Request } from "express";

export interface TypesRequest<T> extends Request {
  body: T;
}
