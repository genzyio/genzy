import { Plugin } from "../src";
import { GenzyContainer } from "@genzy.io/client";
import {
  Body,
  Controller,
  Get,
  GenzyApi,
  Path,
  Post,
  Put,
  Query,
  int,
  string,
} from "@genzy.io/api";
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
    const genzy = new GenzyContainer().addLocalService(TestController);
    const app = new GenzyApi()
      .addPlugin(new Plugin())
      .buildAppFrom(genzy);

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
