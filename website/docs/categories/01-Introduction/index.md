---
title: Introduction
sidebar_position: 1
slug: /
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What Genzy is

Genzy is a JavaScript library that enables rapid development of web applications.

It is built on top of the [Express](https://expressjs.com/) framework and provides additional features like automatic routes registration, client code generation and [OpenAPI](https://www.openapis.org/) documentation, along with [SwaggerUI](https://swagger.io/).

Here's a basic example:

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

#### Server
```js
const { GenzyContainer, GenzyApi } = require('@genzy/api');

class UserService {
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

class AccountService {
  // UserService is automatically injected
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAllAccounts() {
    return [];
  }

  // take accountInfo object as parameter 
  async createAccount({username}) {
    // logic for adding the account
    const newAccount = {id: 1, username};
    // call another service
    this.userService.createUser({ accountId: newAccount.id })
    return newAccount;
  }
}

const usersGenzyContainer = new GenzyContainer()
  .addLocalServices(UserService, AccountService);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```
</TabItem>
  <TabItem value="js" label="ES modules" default>

#### Server
```js
import { GenzyContainer, GenzyApi } from '@genzy/api';

class UserService {
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

class AccountService {
  // UserService is automatically injected
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAllAccounts() {
    return [];
  }

  // take accountInfo object as parameter 
  async createAccount({username}) {
    // logic for adding the account
    const newAccount = {id: 1, username};
    // call another service
    this.userService.createUser({ accountId: newAccount.id })
    return newAccount;
  }
}

const usersGenzyContainer = new GenzyContainer()
  .addLocalServices(UserService, AccountService);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```
</TabItem>
  <TabItem value="ts" label="TypeScript" default>

#### Server
```ts
import { GenzyContainer, GenzyApi, Controller, Post, Get } from '@genzy/api';

@Controller('/users')
class UserService {
  @Post()
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

@Controller('/accounts')
class AccountService {
  // UserService is automatically injected
  constructor({ userService }) {
    this.userService = userService;
  }

  @Get('/all')
  async getAllAccounts() {
    return [];
  }

  // take accountInfo object as parameter 
  async createAccount({username}) {
    // logic for adding the account
    const newAccount = {id: 1, username};
    // call another service
    this.userService.createUser({ accountId: newAccount.id })
    return newAccount;
  }
}

const usersGenzyContainer = new GenzyContainer()
  .addLocalServices(UserService, AccountService);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```
  </TabItem>
</Tabs>
<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

#### Client

```js
const { GenzyContainer } = require('@genzy/client');

const host = 'http://localhost:3000';

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersGenzyContainer = new GenzyContainer()
  .addRemoteServices(host, UserService, AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersGenzyContainer.getAllServices();

// Use the services
accountService.createAccount({
  username: 'test',
})
.then(newAccount => console.log(newAccount)) // created account from server
.catch(error => console.log(error));

// Fetch all accounts
const allAccounts = await accountService.getAllAccounts();
```
  </TabItem>
  <TabItem value="js" label="ES modules" default>

#### Client

```js
import { GenzyContainer } from '@genzy/client';

const host = 'http://localhost:3000';

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersGenzyContainer = new GenzyContainer()
  .addRemoteServices(host, UserService, AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersGenzyContainer.getAllServices();

// Use the services
accountService.createAccount({
  username: 'test',
})
.then(newAccount => console.log(newAccount)) // created account from server
.catch(error => console.log(error));

// Fetch all accounts
const allAccounts = await accountService.getAllAccounts();
```
  </TabItem>
  <TabItem value="ts" label="TypeScript" default>

#### Client

```ts
import { GenzyContainer, Controller, Post, Get } from '@genzy/client';

const host = 'http://localhost:3000';

// With TS you can use decorators
@Controller('/users')
class UserService {
  @Post()
  async createUser(user) {}
}

@Controller('/accounts')
class AccountService {
  @Get('/all')
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersGenzyContainer = new GenzyContainer()
  .addRemoteServices(host, UserService, AccountService);

type GenzyServices = {
  userService: UserService,
  accountService: AccountService
}

// The instances are available for custom usage
const { userService, accountService }: GenzyServices = usersGenzyContainer.getAllServices();

// Use the services
accountService.createAccount({
  username: 'test',
})
.then(newAccount => console.log(newAccount)) // created account from server
.catch(error => console.log(error));

// Fetch all accounts
const allAccounts = await accountService.getAllAccounts();
```
  </TabItem>
</Tabs>

## Features

Here are the features provided by Genzy:

### API

Express Application is automatically created based on the service classes passed to the GenzyContainer.

### Client

Client service proxy is automatically created based on the service classes passed to the GenzyContainer.

### Automatic JS/TS Client generation

`@genzy/client` package can be used to auto-generate client service files for the existing API.

### Interceptors

Both Server and Client support defining interceptors. Most common use case for interceptors is handling Authorization, where the client sends a secret with an identity and the server validates it.

### Automatic OpenAPI docs

Server automatically builds [OpenAPI](https://www.openapis.org/) documentation, and serves [SwaggerUI](https://swagger.io/) on route `/explorer`.

## Next steps

- [Server installation](../02-Server/server-installation.md)
- [Client installation](../03-Client/client-installation.md)
