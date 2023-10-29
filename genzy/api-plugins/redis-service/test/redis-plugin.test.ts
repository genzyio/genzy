import { Plugin } from "../src";
import { RedisService } from "../src/redis-service";
import { GenzyContainer } from "@genzy.io/client";
import {
  Body,
  Controller,
  Delete,
  Get,
  GenzyApi,
  Post,
  Query,
} from "@genzy.io/api";
import { agent } from "supertest";

@Controller("/cache")
class CacheController {
  private redisService: RedisService;

  constructor(deps: { redis: { redisService: RedisService } }) {
    this.redisService = deps.redis.redisService;
  }

  @Get("/")
  async getCachedValue(@Query("key") key: string) {
    return this.redisService.get(key);
  }

  @Post("/")
  async cacheValue(@Query("key") key: string, @Body() value: object) {
    this.redisService.set(key, JSON.stringify(value));
  }

  @Delete("/")
  async deleteCachedValue(@Query("key") key: string) {
    this.redisService.delete(key);
  }
}

describe("Plugin", () => {
  it("should register service instance before all", async () => {
    const genzy = new GenzyContainer().addLocalService(CacheController);
    const app = new GenzyApi()
      .addPlugin(new Plugin({ containers: [genzy] }))
      .buildAppFrom(genzy);

    await agent(app).get("/api/cache?key=perisimus").expect(200, "");
    await agent(app)
      .post("/api/cache?key=perisimus")
      .send({ pera: `perisimus maximus docus` })
      .expect(200);

    const res = await agent(app).get("/api/cache?key=perisimus").expect(200);
    expect(JSON.parse(res.body)).toStrictEqual({ pera: `perisimus maximus docus` });
    await agent(app).delete("/api/cache?key=perisimus").expect(200);
    await agent(app).get("/api/cache?key=perisimus").expect(200, "");
  });
});
