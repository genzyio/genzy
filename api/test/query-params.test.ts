import { N1mblyContainer } from "@n1mbly/client";
import { N1mblyApi } from "../src/n1mbly-api";
import { agent } from "supertest";
import { Get, Query } from "../../shared/decorators";
import { N1mblyConfig } from "../../shared/types";

class TestService {
  $nimbly: N1mblyConfig = {
    get: {
      params: [{ name: "test", source: "query" }],
    },
    getMultiple: {
      params: [
        { name: "test", source: "query" },
        { name: "test2", source: "query" },
      ],
    },
  };

  async get(test) {
    return { test };
  }

  async getMultiple(test, test2) {
    return { test, test2 };
  }

  @Get("/decorated")
  async decorated(
    @Query("testing") testing: string,
    @Query("another") another: string
  ) {
    return { testing, another };
  }
}

describe("QueryParams", () => {
  it("should register a path that is able to receive query params", async () => {
    const container = new N1mblyContainer().addLocalService(TestService);
    const app = new N1mblyApi().buildAppFrom(container);

    await agent(app)
      .get("/api/test-service/get?test=123")
      .expect(200, { test: "123" });
  });

  it("should return undefined for not passed query param", async () => {
    const container = new N1mblyContainer().addLocalService(TestService);
    const app = new N1mblyApi().buildAppFrom(container);

    await agent(app).get("/api/test-service/get").expect(200, {});
  });

  it("should register a path that is able to receive multiple query params", async () => {
    const container = new N1mblyContainer().addLocalService(TestService);
    const app = new N1mblyApi().buildAppFrom(container);

    await agent(app)
      .get("/api/test-service/get-multiple?test=asdf&test2=123")
      .expect(200, {
        test: "asdf",
        test2: "123",
      });
  });

  it("should register a path that is able to receive query params with Query decorator", async () => {
    const container = new N1mblyContainer().addLocalService(TestService);
    const app = new N1mblyApi().buildAppFrom(container);

    await agent(app)
      .get("/api/test-service/decorated?testing=asdf&another=123")
      .expect(200, {
        testing: "asdf",
        another: "123",
      });
  });
});
