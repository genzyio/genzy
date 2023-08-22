import { Nimble } from "@n1mbly/client";
import { NimblyApi } from "../src/nimbly-api";
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

class TestService {
  async get() {}
}

class Example {
  @string test: string;
  @boolean bool: boolean;
  @int num: number;
}

@Controller("/")
class Test3Service {
  @Post("/:one/:three")
  @Returns(Example)
  async get(
    @Path("one") @string one: string,
    @Query("two") @int two: number,
    @Path("three") @boolean three: boolean,
    @Body() @type(Example) body: Example
  ) {}
}

describe("NimblyApi Meta Info", () => {
  it("should register meta path", async () => {
    const meta = RegisterRoutesFor(new TestService(), express());

    const nimble = new Nimble().addLocalService(TestService);
    const app = new NimblyApi().from(nimble);

    await agent(app)
      .get("/api/meta")
      .then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body.services).toStrictEqual([meta.service]);
        // TODO: assert that types are registered correctly
      });
  });

  it("should register meta path with all types and params", async () => {
    const serviceMeta = RegisterRoutesFor(new Test3Service(), express());

    const exampleType = {
      ...(new Example() as any).$nimbly_config.types,
      $isArray: false,
      $typeName: "Example",
    };

    // TODO: assert that types are registered correctly

    expect(serviceMeta.service.actions).toHaveLength(1);

    const action = serviceMeta.service.actions[0];

    expect(action.httpMethod).toBe("post");
    expect(action.name).toBe("get");
    expect(action.path).toBe("/:one/:three");

    const bodyParam = action.params.find((p) => p.source === "body");
    const pathParams = action.params.filter((p) => p.source === "path");
    const queryParams = action.params.filter((p) => p.source === "query");

    expect(bodyParam?.type).toStrictEqual(exampleType);
    expect(pathParams.map((p) => p.type)).toHaveLength(2);
    expect(pathParams.map((p) => p.type)).toContainEqual(BASIC_TYPES.string);
    expect(pathParams.map((p) => p.type)).toContainEqual(BASIC_TYPES.boolean);
    expect(queryParams.map((p) => p.type)).toHaveLength(1);
    expect(queryParams.map((p) => p.type)).toContainEqual(BASIC_TYPES.int);

    expect(pathParams.map((p) => p.name)).toHaveLength(2);
    expect(pathParams.map((p) => p.name)).toContainEqual("one");
    expect(pathParams.map((p) => p.name)).toContainEqual("three");

    expect(queryParams.map((p) => p.name)).toHaveLength(1);
    expect(queryParams.map((p) => p.name)).toContainEqual("two");

    expect(action.result).toStrictEqual(exampleType);
  });

  it("should register meta on a different base path", async () => {
    const meta = RegisterRoutesFor(
      new TestService(),
      express(),
      undefined,
      undefined,
      "/api/v1"
    );

    const nimble = new Nimble().addLocalService(TestService);
    const app = new NimblyApi({ basePath: "/api/v1" }).from(nimble);

    await agent(app)
      .get("/api/v1/meta")
      .then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body.services).toStrictEqual([meta.service]);
        // TODO: assert that types are registered correctly
      });
  });
});
