import { Nimble } from "../../client/src";
import { Get, Post, Service } from "../../client/src";

class TestService {
  $nimbly = {
    rootPath: "/tests",
    get: {
      method: "GET",
      path: "/:id",
    },
    update: {
      method: "PUT",
      path: "/:id",
      body: true,
    },
  };

  async get(id) {}

  async update(id, body) {}
}

@Service("/")
class DecoratedService {
  @Get("/:id")
  async test(id: string) {}

  @Post()
  async post(body: any) {}
}

export type NimblyServices = {
  testService: TestService,
  decoratedService: DecoratedService,
}

const origin = "http://localhost:3000";
export const {
  testService,
  decoratedService
}: NimblyServices = new Nimble()
  .ofRemote(TestService, origin, '/api/v1')
  .andRemote(DecoratedService, origin, '/api/v1')
  .services();
