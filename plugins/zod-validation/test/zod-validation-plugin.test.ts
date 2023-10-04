import { Plugin } from "../src";
import { N1mblyContainer } from "@n1mbly/client";
import {
  Body,
  Controller,
  Get,
  N1mblyApi,
  Path,
  Post,
  Put,
  Query,
  int,
  string,
} from "@n1mbly/api";
import { agent } from "supertest";

class Test {
  @string()
  name: string;
  @int()
  age: number;
}

@Controller("/tests")
class TestController {
  @Get("/")
  async get(
    @Query("filter", { type: "int", optional: true, array: true })
    filter: string[]
  ) {
    return filter;
  }

  @Post("/")
  async add(@Body({ type: Test }) test: Test) {
    return test;
  }

  @Put("/:id")
  async update(
    @Path("id", { type: "int" }) id: number,
    @Body({ type: Test }) test: Test
  ) {
    return test;
  }
}

describe("Plugin", () => {
  it("should register before interceptors for object", async () => {
    const n1mbly = new N1mblyContainer().addLocalService(TestController);
    const app = new N1mblyApi()
      .addPlugin(new Plugin())
      .buildAppFrom(n1mbly);

    await agent(app).get("/api/tests?filter=1").expect(400);
    await agent(app).get("/api/tests?filter=asdf&filter=fdsa").expect(400);
    await agent(app).post("/api/tests").expect(400);
    await agent(app).put("/api/tests/asdf").expect(400);

    await agent(app).get("/api/tests").expect(200);
    await agent(app).get("/api/tests?filter=123&filter=321").expect(200);
    await agent(app)
      .post("/api/tests")
      .send({
        name: "test",
        age: 12,
      })
      .expect(200);
    await agent(app)
      .put("/api/tests/123")
      .send({
        name: "test",
        age: 12,
      })
      .expect(200);
  });
});
