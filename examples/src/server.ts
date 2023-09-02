import {
  GenericType,
  N1mblyApi,
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
} from "../../api/src";
import { Get, Post, Controller, N1mblyContainer } from "../../client/src";

class NoviServis {
  async getNesto() {
    return { numbers: [1, 2, 3, 4] };
  }
}

const noviModul = new N1mblyContainer().addLocalServices(NoviServis);

class Peraa {
  @string() hello: string;
}

class Test {
  @string() username: string;
  @string() password: string;

  @arrayOf(Peraa)
  peraas: Peraa[];
}

class Account {
  @string() username: string;
  @string() password: string;

  @arrayOf(Test) tests: Test[];
}

class User {
  @string() name: string;
  @string() surname: string;
  @int({ optional: true }) age?: number;

  @type(Account, { optional: true }) account?: Account;
}

@Controller("/auth")
class AuthController {
  @Get("/")
  @Returns(User)
  async getLoggedInUser(): Promise<User> {
    return {
      name: "pera",
      surname: "nikola me zovu",
      age: 10,
    };
  }

  @Post("/login")
  @Returns(User)
  async logIn(@Body({ type: User }) user: User): Promise<User> {
    return user;
  }
}

class CrudController {
  @Get("/:id")
  @Returns(GenericType)
  findOne(@Path("id", { type: "string" }) id: string) {
    return null;
  }

  @Get("/")
  @ReturnsArrayOf(GenericType)
  findMany() {
    return null;
  }

  @Post("/")
  @Returns(GenericType)
  create(@Body({ type: GenericType }) entity: any) {
    return null;
  }

  @Put("/:id")
  @Returns(GenericType)
  update(
    @Path("id", { type: "string" }) id: string,
    @Body({ type: GenericType }) entity: any
  ) {
    return null;
  }

  @Delete("/:id")
  @Returns(GenericType)
  delete(@Path("id", { type: "string" }) id: string) {
    return null;
  }
}

@Controller("/users", User)
class UserCrudController extends CrudController {}

class Pera {
  @string() username: string;
  @string() password: string;
  @boolean() car: boolean;
}

@Controller("/peras", Pera)
class PeraCrudController extends CrudController {
  findOne(id: string) {
    return {
      id,
      car: true,
    };
  }
}

const modul = new N1mblyContainer().addLocalServices(
  AuthController,
  PeraCrudController,
  UserCrudController
);

export const api = new N1mblyApi({
  n1mblyInfo: {
    version: "0.0.1-alpha1",
    name: "Test Microservice",
    description: "This microservice is used for random stuff.",
  },
}).buildAppFrom(modul, noviModul);
