import { Plugin as ZodValidationPlugin } from "n1mbly-zod-validation";
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
  stringArray,
  floatArray,
} from "../../api/src";
import { Get, Post, Controller, N1mblyContainer } from "../../client/src";

// import pg from "pg"; // v2.1.0
// jos 3 npr

// v3.4.6

// gn1mbly paket
// expose API za registrovanje plugina

// generisan kod paket (mikroservis proj)
// u njega treba install pg-adapter
// ovaj nema gn1mbly instaliran

// class PgAdapter {
//   constructor(
//     private host: string,
//     private port: string,
//     private username: string,
//     private password: string
//   ) {}

//   register({ register }) {

//   }

//   onInit() {
//     // connect to db
//     // using host, port, username, password
//     pg.init();
//   }

//   onDestroy() {
//     // disconnect
//     // cleanup
//   }

//   // API
//   getInstance() {
//     // custom logic ...
//   }

//   // Simplified API
//   runQuery(sql: string) {
//     // exec sql
//   }
// }

// class PgAdapterPlus {
//   constructor(
//     private host: string,
//     private port: string,
//     private username: string,
//     private password: string
//   ) {}

//   register({ register }) {

//   }

//   onInit() {
//     // connect to db
//     // using host, port, username, password
//     pg.init();
//   }

//   onDestroy() {
//     // disconnect
//     // cleanup
//   }

//   // API
//   getInstance() {
//     // custom logic ...
//   }

//   // Simplified API
//   runQuery(sql: string) {
//     // exec sql
//   }
// }

// class PgAdapterPlugin implements N1mblyPlugin {
//   register() {
//     // implement registration logic
//     // support register before and after all
//   }
// }

// // mikroservis
// n1mbly.register(PgAdapterPlugin, {
//   configure(n1mbly) {
//     //
//   }
// })

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

  @stringArray() roles: string[];

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
      roles: ["admin", "user"],
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
  delete(
    @Path("id", { type: "string" }) id: string,
    @Query("q", { type: "string", array: true }) q: string[]
  ) {
    return null;
  }
}

@Controller("/users", User)
class UserCrudController extends CrudController {}

class Pera {
  @string() username: string;
  @string() password: string;
  @boolean() car: boolean;
  @arrayOf("string", { optional: true }) test: string[];
}

@Controller("/peras", Pera)
class PeraCrudController extends CrudController {
  constructor(private isCar: boolean) {
    super();
  }

  findOne(id: string) {
    return {
      id,
      car: true,
    };
  }

  @Get("/pera-jaje")
  @ReturnsArrayOf("string")
  peraJaje() {
    return {
      id: "pera",
      car: this.isCar,
    };
  }
}

const modul = new N1mblyContainer().addLocalServices(
  AuthController,
  PeraCrudController,
  UserCrudController
);

// export const api = new N1mblyApi({
//   n1mblyInfo: {
//     version: "0.0.1-alpha1",
//     name: "Test Microservice",
//     description: "This microservice is used for random stuff.",
//     port: 3000,
//   },
// }).buildAppFrom(modul, noviModul);

//////

class Model {
  @string() id: string;
  @int() age: number;
  @boolean() car: boolean;
  @floatArray({ optional: true }) numbers: number[];
}

@Controller("/test")
class ModelController {
  private service: ModelService;

  constructor({ services }: { services: { modelService: ModelService } }) {
    this.service = services.modelService;
  }

  @Get("/:id")
  @Returns(Model)
  async getModelById(
    @Path("id", { type: "string" }) id: string
  ): Promise<Model> {
    return this.service.getModelById(id);
  }

  @Post("/")
  @Returns(Model)
  async postModel(@Body({ type: Model }) model: Model): Promise<Model> {
    return this.service.postModel(model);
  }
}

class ModelService {
  constructor(d) {
    console.log(d);
  }

  async getModelById(id: string): Promise<Model> {
    return {
      id: "pera",
      age: 10,
      car: true,
      numbers: [1.2, 2.3, 3.4],
    };
  }

  async postModel(model: Model): Promise<Model> {
    return model;
  }
}

class A {
  constructor(d) {
    console.log(d);
  }
}

class B {
  constructor(d) {
    console.log(d);
  }
}

class AB {
  constructor(d) {
    console.log(d);
  }
}

class AC {
  constructor(d) {
    console.log(d);
  }
}

class BC {
  constructor(d) {
    console.log(d);
  }
}

const controllers = new N1mblyContainer().addLocalServices(ModelController);

const services = new N1mblyContainer()
  .addLocalServices(ModelService, A, B)
  .addLocalService(AB);

const s = new N1mblyContainer().addLocalServices(AC);

services.addAccessToContainer("s", s);

const b = new N1mblyContainer().addLocalServices(BC);

s.addAccessToContainer("b", b);

controllers.addAccessToContainer("services", services);

export const api = new N1mblyApi()
  .addPlugin(new ZodValidationPlugin())
  .buildAppFrom(controllers);

// app.listen(4040, () => {
//   console.log("Server started on port 4040");
// });
