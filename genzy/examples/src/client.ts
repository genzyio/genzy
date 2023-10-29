import { GenzyContainer } from "../../sdk/client/src";
import { Get, Post, Controller } from "../../sdk/client/src";
import { Query } from "../../sdk/shared/decorators";

class TestService {
  $genzy = {
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

export type GenzyServices = {
  testService: TestService;
  decoratedService: DecoratedService;
  noviServis: NoviServis;
};

const origin = "http://localhost:3030/api";
export const { testService, decoratedService, noviServis }: GenzyServices =
  new GenzyContainer()
    .addRemoteServices(origin, TestService, DecoratedService, NoviServis)
    .getAllServices();

// noviServis.getNesto().then(console.log);
