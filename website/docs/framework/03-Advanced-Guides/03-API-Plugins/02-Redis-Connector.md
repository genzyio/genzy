### Registering a service for accessing Redis Cache

- Redis Cache access that registers a service to passed containers

1. `npm i -S genzy-redis-plugin`

```ts
import { Plugin as GenzyRedisPlugin, RedisService } from "genzy-redis-plugin";

class TestService {
  private redisService: RedisService;

  constructor({ redisService }: { redisService: RedisService }) {
    this.redisService = redisService;
  }

  async check(key: string) {
    const fromCache = await this.redisService.get(key);
    if (!fromCache) {
      throw new Error("Key not found.");
    }
  }
}

const controllers = new GenzyContainer();

const services = new GenzyContainer().addLocalService(TestService);

const app = new GenzyApi()
  .addPlugin(new GenzyRedisPlugin({ containers: [services] }))
  .buildAppFrom(controllers);

// now TestService has access to RedisService that is automatically injected
```
