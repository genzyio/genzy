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

export const api = new N1mblyApi({
  n1mblyInfo: {
    version: "0.0.1-alpha1",
    name: "Test Microservice",
    description: "This microservice is used for random stuff.",
    port: 3000,
  },
}).buildAppFrom(modul, noviModul);
