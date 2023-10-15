---
title: Creating the API
sidebar_label: Creating the API
sidebar_position: 1
slug: /quickstart/api
---

# Creating the API

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

5. `npm i -S @genzy.io/api`
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
import { string, boolean } from "@genzy.io/api";

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
import { Controller, Post } from "@genzy.io/api";

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
import { GenzyContainer } from "@genzy.io/api";

const controllers = new GenzyContainer().addLocalServices(AccountController);

const services = new GenzyContainer().addLocalServices(
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
import { GenzyApi } from "@genzy.io/api";

// returns Express Application
const app = new GenzyApi({
  genzyInfo: {
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
# there is also a special /api/meta route used by Genzy to generate code
```
