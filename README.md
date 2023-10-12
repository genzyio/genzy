# N1mbly

A simple framework for building better API-s faster.

[![NPM](https://nodei.co/npm/@n1mbly/client.png)](https://nodei.co/npm/@n1mbly/client/)
[![NPM](https://nodei.co/npm/@n1mbly/api.png)](https://nodei.co/npm/@n1mbly/api/)

# Table of contents

1. [Quickstart](#quickstart)
   1. [Creating the API](#creating-the-api)
   2. [Generating the client](#generating-the-client)
2. [Mechanisms](#mechanisms)
   1. [API Plugins](#api-plugins)
      1. [Adding validation of API requests](#adding-validation-of-api-requests)
      2. [Registering a service for accessing Redis Cache](#registering-a-service-for-accessing-redis-cache)
   2. [API Interceptors](#api-interceptors)
   3. [Client Interceptors](#client-interceptors)
3. [API Custom Error to Status Code Mapping](#api-custom-error-to-status-code-mapping)
4. [Creating a custom Plugin](#creating-a-custom-plugin)

# Quickstart

Here's a way to ceate a simple API and generate the client code for accessing it.

## Creating the API:

1. `npm init -y`
2. `npm i -D typescript ts-node`
3. `npx tsc --init`
4. Update `tsconfig.json`:

```json
{
  // ...
  "experimentalDecorators": true,
  "strictPropertyInitialization": false
}
```

5. `npm i -S @n1mbly/api`
6. Implement services

```ts
class AccountService {
  private userService: UserService;

  // UserService is automatically injected
  constructor({ userService }: { userService: UserService }) {
    this.userService = userService;
  }

  async createAccount(account: Account): Promise<Account> {
    if (await this.userService.checkIfUserExists(account.username)) {
      throw new UserAlreadyExistsError(
        `A user '${account.username}' already exists.`
      );
    }
    // logic for adding the account
    const newAccount = { id: 1, ...account };
    // return result
    return newAccount;
  }
}

// models
import { string, boolean } from "@n1mbly/api";

class Account {
  @string() username: string;
  @boolean() isAdmin: boolean;
}

// errors
class UserAlreadyExistsError extends Error {
  name = "UserAlreadyExistsError";
  constructor(message?: string) {
    super(message);
  }
}

class UserService {
  private userRepository: UserRepository;

  // UserRepository is automatically injected
  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async checkIfUserExists(username: string): Promise<boolean> {
    // logic for checking if user exists
    const user = await this.userRepository.findByUsername(username);
    return !!user;
  }
}

class UserRepository {
  async findByUsername(username: string) {
    // logic for finding a user from db by username
    return { username };
  }
}
```

4. Create a controller

```ts
import { Controller, Post } from "@n1mbly/api";

@Controller("/account")
class AccountController {
  private accountService: AccountService;

  constructor({ services }: { services: { accountService: AccountService } }) {
    this.accountService = services.accountService;
  }

  @Post("/")
  @Returns(Account)
  async create(@Body({ type: Account }) account: Account): Promise<Account> {
    return this.accountService.createAccount(account);
  }
}
```

5. Create a Container of controllers and services

```js
import { N1mblyContainer } from "@n1mbly/api";

const controllers = new N1mblyContainer().addLocalServices(AccountController);

const services = new N1mblyContainer().addLocalServices(
  UserService,
  AccountService,
  UserRepository
);

// add access to services
controllers.addAccessToContainer("services", services);

// you can get service instances directly from the container
const { userService, accountService, userRepository } = services.getServices();
```

5. Create the API

```js
import { N1mblyApi } from "@n1mbly/api";

// returns Express Application
const app = new N1mblyApi({
  n1mblyInfo: {
    name: "Account API",
    version: "0.0.1",
    description: "This API is used for creating accounts.",
  },
})..buildAppFrom(controllers);

// start the server
app.listen(3000);
```

=>

```bash
# POST /api/account route is registered
# you can go to /explorer and use Swagger UI
# there is also a special /api/meta route used by N1mbly to generate code
```

## Generating the client

Once you've created the API, the client code for accessing it can be automatically generated from the meta information provided by the API.

In your client project:

1. `npm i -S @n1mbly/client`
2. `npm i -g @n1mbly/cli`
3. To generate the client code for accessing the API run:

```bash
n1mbly -l ts -o ./src/account-client -h http://localhost:3000/api
```

```ts
import { N1mblyContainer } from "@n1mbly/client";

const host = "http://localhost:3000";

const container = new N1mblyContainer().addRemoteService(
  AccountController,
  host
);

// The instances are available for custom usage
const { accountController } = container.getServices();

// Use the services
accountController
  .createAccount({
    username: "test",
    isAdmin: false,
  })
  .then((newAccount) => console.log(newAccount)) // created account from server
  .catch((error) => console.log(error));
```

# Mechanisms

Here are some additional mechanisms for handling different use cases.

## API Plugins

Here are examples of two different plugins:

### Adding validation of API requests

- Zod validation that registers interceptors

1. `npm i -S n1mbly-zod-validation`

```ts
import { Plugin as N1mblyZodValidationPlugin } from "n1mbly-zod-validation";

// ...

const app = new N1mblyApi()
  .addPlugin(new N1mblyZodValidationPlugin())
  .buildAppFrom(controllers);

// now types of request parameters (path, query and body) get validated
```

### Registering a service for accessing Redis Cache

- Redis Cache access that registers a service to passed containers

1. `npm i -S n1mbly-redis-plugin`

```ts
import { Plugin as N1mblyRedisPlugin, RedisService } from "n1mbly-redis-plugin";

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

const controllers = new N1mblyContainer();

const services = new N1mblyContainer().addLocalService(TestService);

const app = new N1mblyApi()
  .addPlugin(new N1mblyRedisPlugin({ containers: [services] }))
  .buildAppFrom(controllers);

// now TestService has access to RedisService that is automatically injected
```

## API Interceptors

A mechanism for intercepting API requests and it's results. It can be used for things like validating headers, parsing the request or response body, etc.

```ts
// Intercept all service handlers before they are called
const app = new N1mblyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if (isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers before they are called
const container = new N1mblyContainer().addLocalService(UserService);
const app = new N1mblyApi()
  .intercept({
    accountController: {
      create: (req: Request, res: Response, next: NextFunction) => {
        if (isAdminUser(req.headers.Authorization)) next();
        else res.sendStatus(401);
      },
    },
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers before they are called with Interceptor class
class AccountControllerInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    if (isAdminUser(req.headers.Authorization)) next();
    else res.sendStatus(401);
  }
}
const container = new N1mblyContainer().addLocalService(UserService);
const app = new N1mblyApi()
  .intercept({
    accountController: {
      create: AccountControllerInterceptor,
    },
  })
  .buildAppFrom(controllers);

// Intercept all service handlers after they are called
const container = new N1mblyContainer().addLocalService(UserService);
const app = new N1mblyApi()
  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
    res.body({ message: "Hello from N1mbly." });
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers after they are called
const container = new N1mblyContainer().addLocalService(UserService);
const app = new N1mblyApi()
  .interceptAfter({
    accountController: {
      create: (req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      },
    },
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers after they are called with Interceptor class
class AccountControllerInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    res.status(201);
    next();
  }
}
const container = new N1mblyContainer().addLocalService(UserService);
const app = new N1mblyApi()
  .interceptAfter({
    accountController: {
      create: AccountControllerInterceptor,
    },
  })
  .buildAppFrom(controllers);
```

## Client Interceptors

A mechanism for intercepting client API calls and it's results. It can be used for things like setting custom headers, parsing the response body, etc.

```ts
// Intercept all service calls
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptAllCalls(({ setHeader, getHeader, setBody, getBody }) => {
    setHeader("Authorization", "Bearer <token>");
  });

// Intercept only specific method calls
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptCalls({
    accountController: {
      create({ setHeader, getHeader, setBody, getBody }) {
        setBody({ ...getBody(), timestamp: new Date() });
      },
    },
  });

// Define interceptors with an interceptor class
class AccountControllerCallInterceptor {
  create({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classCallInterceptor", "Works!");
  }
}
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptCalls({
    accountController: AccountControllerCallInterceptor,
  });

// Intercept all service results
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptAllResults(({ setHeader, getHeader, setBody, getBody }) => {
    validateBody(getBody());
    setToken(getHeader("Token"));
  });

// Intercept only specific method results
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptResults({
    accountController: {
      create({ setHeader, getHeader, setBody, getBody }) {
        setBody({ ...getBody(), count: getBody().items.length });
      },
    },
  });

// Define interceptors with an interceptor class
class AccountControllerResultInterceptor {
  create({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classResultInterceptor", "Works!");
  }
}
const container = new N1mblyContainer()
  .addRemoteService(UserService, host)
  .interceptResults({
    accountController: AccountControllerResultInterceptor,
  });
```

## API Custom Error to Status Code Mapping

```js
class BadLogicError extends Error {
  name = "BadLogicError";
  constructor(message?: string) {
    super(message);
  }
}
class InternalServerError extends Error {
  name = "InternalServerError";
  constructor(message?: string) {
    super(message);
  }
}
const app = new N1mblyApi()
  .withErrors({
    [BadLogicError.name]: 400,
    [InternalServerError.name]: 500,
  })
  .buildAppFrom(controllers);
```

## Creating a custom Plugin

The only requirement is that the plugin needs to expose the Plugin class. The class has access to all meta information, api and provided containers.

```ts
export { Application, Request, Response, NextFunction } from "express";
import {
  N1mblyPlugin,
  N1mblyConfig,
  ServiceMetaInfo,
  MetaTypesRegistry,
  N1mblyPluginParams,
  N1mblyContainer,
} from "@n1mbly/api";

export class Plugin extends N1mblyPlugin {
  constructor(params?: { containers?: N1mblyContainer[] });

  beforeAll(params: N1mblyPluginParams): void | Promise<void>;
  beforeRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
    }
  ): void | Promise<void>;
  afterRouteRegister(
    params: N1mblyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      n1mblyConfig: N1mblyConfig;
      meta: ServiceMetaInfo & { types: MetaTypesRegistry };
    }
  ): void | Promise<void>;
  afterAll(params: N1mblyPluginParams): void | Promise<void>;
}
```
