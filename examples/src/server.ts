import { GenericType, N1mblyApi } from "../../api/src";
import { Get, Post, Controller, N1mblyContainer } from "../../client/src";
import {
  arrayOf,
  Body,
  boolean,
  Delete,
  int,
  Path,
  Put,
  Query,
  Returns,
  ReturnsArrayOf,
  string,
  type,
} from "../../shared/decorators";

// class TestService {
//   $nimbly = {
//     rootPath: "/tests",
//     get: {
//       method: "GET",
//       path: "/:id",
//     },
//     update: {
//       method: "PUT",
//       path: "/:id",
//       body: true,
//     },
//   };

//   get(id) {
//     return [1, 2, 3];
//   }

//   update(id, body) {
//     return [1, 2, 3];
//   }
// }

class Test {
  @string() test: string;
  @int() asdf: number;
}

class Model {
  @string() name: string;
  @int({ optional: true }) age: number;
  @boolean() isMale: boolean;
  // @arrayOf(Test) tests: Test[]; // TODO: support this
}

// @Controller("/decorated")
// class DecoratedService {
//   private testService: TestService;

//   constructor({ testService }: { testService: TestService }) {
//     this.testService = testService;
//   }

  @Get("/:id")
  test(
    @Path("id", { type: "string" }) id: string,
    @Query("test", { type: "int" }) test?: string
  ) {
    return { id, arr: this.testService.get(id), test };
  }

//   @Post()
//   @ReturnsArrayOf(Model)
//   post(@type(Model) body: Model) {
//     return body;
//   }
// }

@Controller("/configuration", Model)
class ConfigurationService {
  private noviServis: NoviServis;
  constructor(services: { novi: { noviServis: NoviServis } }) {
    this.noviServis = services.novi.noviServis;
  }

  @Post()
  @Returns(GenericType)
  getAll(
    @Query("id") @string() id: string,
    @Body({ type: GenericType }) body: Model
  ) {
    return [
      {
        id: "prvi",
        frequency: 1,
        filter: `function filter(value, status) {
          return true;
        }
        function finalFilter(topic, value, status) {
          return filter(value, status) && topic === "test";
        }`,
      },
    ];
  }

//   @Get("/nesto-from-novi")
//   getNestoFromNoviServis() {
//     return this.noviServis.getNesto();
//   }
// }

class NoviServis {
  async getNesto() {
    return { numbers: [1, 2, 3, 4] };
  }
}

const noviModul = new N1mblyContainer().addLocalServices(NoviServis);

// const modul = new N1mblyContainer()
//   .addLocalServices(TestService, DecoratedService, ConfigurationService)
//   .addAccessToContainer("novi", noviModul);

// export const api = new N1mblyApi({
//   n1mblyInfo: {
//     version: "0.0.1-alpha1",
//     name: "Random Microservice",
//     description: "This microservice is used for random stuff.",
//   },
// }).buildAppFrom(modul, noviModul);

class User {
  @string username: string;
  @string password: string;
  @int age: number;
}

@Controller("/user")
class UserService {
  @Get("/")
  @Returns(User)
  async getLoggedInUser(): Promise<User> {
    return {
      username: "pera",
      password: "nikola me zovu",
      age: 10,
    };
  }

  @Post("/login")
  @Returns(User)
  async logIn(@Body(User) user: User): Promise<User> {
    return user;
  }
}

class CrudController {
  @Get("/:id")
  @Returns(GenericType)
  findOne(@string @Path("id") id: string) {
    return null;
  }

  @Get("/")
  @ReturnsArrayOf(GenericType)
  findMany() {
    return null;
  }

  @Post("/")
  @Returns(GenericType)
  create(@Body() @type(GenericType) entity: any) {
    return null;
  }

  @Put("/:id")
  @Returns(GenericType)
  update(
    @string @Path("id") id: string,
    @Body() @type(GenericType) entity: any
  ) {
    return null;
  }

  @Delete("/:id")
  @Returns(GenericType)
  delete(@string @Path("id") id: string) {
    return null;
  }
}

@Controller("/users", User)
class UserCrudService extends CrudController {}

class Pera {
  @string username: string;
  @string password: string;
  @boolean car: boolean;
}

@Controller("/peras", Pera)
class PeraCrudService extends CrudController {
  findOne(id: string) {
    return {
      id,
      car: true,
    };
  }
}

const modul = new N1mblyContainer().addLocalServices(
  UserService,
  // UserCrudService,
  PeraCrudService
);

export const api = new N1mblyApi({
  n1mblyInfo: {
    version: "0.0.1-alpha1",
    name: "Test Microservice",
    description: "This microservice is used for random stuff.",
  },
}).buildAppFrom(modul, noviModul);
