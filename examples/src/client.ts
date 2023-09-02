import { N1mblyContainer } from "../../client/src";
import { Get, Post, Controller } from "../../client/src";
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

@Controller("/decorated")
class DecoratedService {
  @Get("/:id")
  async test(id: string, @Query("test") test?: string) {}

  @Post()
  async post(body: any) {}
}

class NoviServis {
  async getNesto() {}
}

export type NimblyServices = {
  testService: TestService;
  decoratedService: DecoratedService;
  noviServis: NoviServis;
};

const origin = "http://localhost:3030/api";
export const { testService, decoratedService, noviServis }: NimblyServices =
  new N1mblyContainer()
    .addRemoteServices(origin, TestService, DecoratedService, NoviServis)
    .getAllServices();

// noviServis.getNesto().then(console.log);
