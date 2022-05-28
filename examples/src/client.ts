import { Nimble } from "../../client/src";
import { Get, Post, Service } from "../../client/src";
import { Query } from "../../shared/decorators";

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
  async test(id: string, @Query('test') test?: string) {}

  @Post()
  async post(body: any) {}
}

class NoviServis {
  async getNesto() {}
}

export type NimblyServices = {
  testService: TestService,
  decoratedService: DecoratedService,
  noviServis: NoviServis
}

const origin = "http://localhost:3030";
export const {
  testService,
  decoratedService,
  noviServis
}: NimblyServices = new Nimble()
  .ofRemote(TestService, origin, '/api')
  .andRemote(DecoratedService, origin, '/api')
  .andRemote(NoviServis, origin, '/api')
  .services();

noviServis.getNesto().then(console.log)
