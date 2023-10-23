export const controllerCode = `
@Controller("/user")
class UserController {

  @Get("/")
  @ReturnsArrayOf(User)
  async getAll() {
    return [];
  }

  @Get("/:id")
  @Returns(User)
  async getOne(@Path("id") id: string) {
    return { id };
  }

  @Post("/")
  @Returns(User)
  async create(@Body({ type: User }) body: any) {
    return { body };
  }

  @Put("/:id")
  @Returns(User)
  async update(@Path("id") id: string, @Body({ type: User }) body: any) {
    return {
      id,
      body,
    };
  }

  @Delete("/:id")
  @Returns(User)
  async delete(@Path("id") id: string) {
    return {
      id,
    };
  }
}

class User {
  @string() id: string;
  @string() username: string;
  @string() password: string;
  @string({ optional: true }) firstName: string;
  @string({ optional: true }) lastName: string;
  @string() email: string;
}
`;

export const moduleCode = `
const apiModule = new GenzyModule()
  .addLocalService(AuthController)
  .addLocalService(UserController);

const authModule = new GenzyModule()
  .addLocalService(AuthService)
  .addLocalService(UserService)
  .addLocalService(UserRepository)
  .addLocalService(RedisService);

apiModule.addAccessToModule("services", authModule);

const app = new GenzyApi({
  genzyInfo: {
    name: "Auth API",
    description: "API for authentication",
    version: "0.0.1",
  },
}).buildAppFrom(apiModule);
`;

export const iocExample = `
import { GenzyApiModuleDeps } from "../index.ts";


export class AuthController {
  private authService: GenzyApiModuleDeps["services"]["authService"];
  private userService: GenzyApiModuleDeps["services"]["userService"];
  private redisService: GenzyApiModuleDeps["services"]["redisService"];

  // automatically injected by the module
  constructor(deps: GenzyApiModuleDeps) {
    this.userService = deps.services.userService;
    this.authService = deps.services.authService;
    this.redisService = deps.services.redisService;
  }

  // ...

}
`;

export const genericsExample = `
import { GenericType } from "genzy";


@Controller("", GenericType)
export class GenericController<T> {
  @Get("/")
  @ReturnsArrayOf(GenericType)
  async getAll(): Promise<T[]> {
    return [];
  }

  @Get("/:id")
  @Returns(GenericType)
  async getOne(@Path("id") id: string): Promise<T> {
    return {};
  }

  @Post("/")
  @Returns(GenericType)
  async create(@Body({ type: GenericType }) body: any): Promise<T> {
    return {};
  }

  @Put("/:id")
  @Returns(GenericType)
  async update(
    @Path("id") id: string,
    @Body({ type: GenericType }) body: any
  ): Promise<T> {
    return {};
  }

  @Delete("/:id")
  @Returns(GenericType)
  async delete(@Path("id") id: string): Promise<T> {
    return {};
  }
}

// concrete implementation
@Controller("/user", User)
export class UserController extends GenericController<User> {
  // you can override the methods
  async create(body: User): Promise<User> {
    console.log(body);
    body.id = "123";
    return super.create(body);
  }
}
`;

export const proxyExample = `
/*
  You can easily integrate with third party APIs
*/

@Controller("/v2/users")
class Auth0UsersProxy {
  // a call to this method will result in
  // a GET request to <HOST>/api/v2/users
  @Get("/")
  @ReturnsArrayOf(User)
  async getAll() {
    return [];
  }
}

/*
  just register it as a remote service
  that points to the external API
*/
const clientModule = new GenzyModule().addRemoteService(
  "https://@@TENANT@@.auth0.com",
  AuthControllerProxy
);

/*
  You can also access your own API
*/

// every controller can also be an HTTP client proxy
@Controller("/auth")
class AuthControllerProxy {
  // a call to this method will result in
  // a POST request to <HOST>/api/auth/login
  @Post("/login")
  @Returns(User)
  async login(@Body({ type: User }) body: any) {
    return {};
  }
}

/*
  just register it as a remote service
  that points to your own API
*/
const clientModule = new GenzyModule().addRemoteService(
  "http://localhost:3000",
  AuthControllerProxy
);
`;

export const pluginsExample = `
const app = new GenzyApi({
  n1mblyInfo: {
    name: "Auth API",
    description: "API for authentication",
    version: "0.0.1",
  },
})
  /*
    Add a plugin for API request validation
    every request will be validated against the
    schema defined in the controller
  */
  .addPlugin(new ZodValidationPlugin())
  /*
    Add a plugin for handling access to
    Redis and injecting the RedisService
    into the specified modules
  */ 
  .addPlugin(new RedisPlugin({ modules: [authModule] }))
  .buildAppFrom(apiModule)
`;

export const codeGenerationExample = `
# In order to generate client code for your API
# that's running on http://localhost:3000, just run:

genzy generate \\
  -l typescript \\
  -h http://localhost:3000/api \\
  -o ./src/client
`;
