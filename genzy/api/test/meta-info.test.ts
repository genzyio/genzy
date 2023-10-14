import { GenzyContainer } from "../src";
import { GenzyApi } from "../src/genzy-api";
import { agent } from "supertest";
import { RegisterRoutesFor } from "../src/routes-handler";
import * as express from "express";
import {
  boolean,
  int,
  Post,
  Query,
  Returns,
  Controller,
  string,
  type,
  Path,
  Body,
} from "../../shared/decorators";
import { BASIC_TYPES } from "../../shared/constants";
import type { BasicType } from "../../shared/types";

class TestService {
  async get() {}
}

class Example {
  @string() test: string;
  @boolean() bool: boolean;
  @int() num: number;
}

@Controller("/")
class Test3Service {
  @Post("/:one/:three")
  @Returns(Example)
  async get(
    @Path("one") @string() one: string,
    @Query("two") @int() two: number,
    @Path("three") @boolean() three: boolean,
    @Body() @type(Example) body: Example
  ) {}
}

describe("GenzyApi Meta Info", () => {
  it("should register meta path", async () => {
    const meta = RegisterRoutesFor(new TestService(), express());

    const container = new GenzyContainer().addLocalService(TestService);
    const app = new GenzyApi().buildAppFrom(container);

    const { types, ...serviceMeta } = meta.service;

    await agent(app)
      .get("/api/meta")
      .then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body.services).toStrictEqual([serviceMeta]);

        // TODO: assert that types are registered correctly
      });
  });

  it("should register meta path with all types and params", async () => {
    const serviceMeta = RegisterRoutesFor(new Test3Service(), express());

    // TODO: assert that types are registered correctly

    expect(serviceMeta.service.actions).toHaveLength(1);

    const action = serviceMeta.service.actions[0];

    expect(action.httpMethod).toBe("post");
    expect(action.name).toBe("get");
    expect(action.path).toBe("/:one/:three");

    const bodyParam = action.params.find((p) => p.source === "body");
    const pathParams = action.params.filter((p) => p.source === "path");
    const queryParams = action.params.filter((p) => p.source === "query");

    expect(bodyParam?.type).toStrictEqual({
      $isArray: false,
      $isOptional: false,
      $typeName: "Example",
    });
    expect(pathParams.map((p) => p.type)).toHaveLength(2);
    expect(pathParams.map((p) => (p.type as BasicType).type)).toContainEqual(
      BASIC_TYPES.string
    );
    expect(pathParams.map((p) => (p.type as BasicType).type)).toContainEqual(
      BASIC_TYPES.boolean
    );
    expect(queryParams.map((p) => p.type)).toHaveLength(1);
    expect(queryParams.map((p) => (p.type as BasicType).type)).toContainEqual(
      BASIC_TYPES.int
    );

    expect(pathParams.map((p) => p.name)).toHaveLength(2);
    expect(pathParams.map((p) => p.name)).toContainEqual("one");
    expect(pathParams.map((p) => p.name)).toContainEqual("three");

    expect(queryParams.map((p) => p.name)).toHaveLength(1);
    expect(queryParams.map((p) => p.name)).toContainEqual("two");

    expect(action.result).toStrictEqual({
      $isArray: false,
      $typeName: "Example",
    });
  });

  it("should register meta on a different base path", async () => {
    const meta = RegisterRoutesFor(
      new TestService(),
      express(),
      undefined,
      undefined,
      "/api/v1"
    );

    const container = new GenzyContainer().addLocalService(TestService);
    const app = new GenzyApi({ basePath: "/api/v1" }).buildAppFrom(container);

    const { types, ...serviceMeta } = meta.service;

    await agent(app)
      .get("/api/v1/meta")
      .then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body.services).toStrictEqual([serviceMeta]);
        // TODO: assert that types are registered correctly
      });
  });
});
