---
title: Introduction
sidebar_position: 1
slug: /
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What Nimbly is

Nimbly is a JavaScript framework that enables rapid development of web applications.

It is built on top of the [Express](https://expressjs.com/) framework and provides additional features like automatic routes registration, client generation and [OpenAPI](https://www.openapis.org/) documentation, along with [SwaggerUI](https://swagger.io/).

Here's a basic example:

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

#### Server
```js
const { Nimble, NimblyApi } = require('nimbly-api');

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

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
</TabItem>
  <TabItem value="js" label="ES modules" default>

#### Server
```js
import { Nimble, NimblyApi } from 'nimbly-api';

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

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
</TabItem>
  <TabItem value="ts" label="TypeScript" default>

#### Server
```ts
import { Nimble, NimblyApi, Service, Post, Get } from 'nimbly-api';

@Service('/users')
class UserService {
  @Post()
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

@Service('/accounts')
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

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
  </TabItem>
</Tabs>
<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

#### Client

```js
const { Nimble } = require('nimbly-client');

const host = 'http://localhost:3000';

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .andRemote(AccountService, host);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();

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
import { Nimble } from 'nimbly-client';

const host = 'http://localhost:3000';

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .andRemote(AccountService, host);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();

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
import { Nimble, Service, Post, Get } from 'nimbly-client';

const host = 'http://localhost:3000';

// With TS you can use decorators
@Service('/users')
class UserService {
  @Post()
  async createUser(user) {}
}

@Service('/accounts')
class AccountService {
  @Get('/all')
  async getAllAccounts() {}
  async createAccount(account) {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .andRemote(AccountService, host);

type NimblyServices = {
  userService: UserService,
  accountService: AccountService
}

// The instances are available for custom usage
const { userService, accountService }: NimblyServices = usersNimble.services();

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

Here are the features provided by Nimbly:

### API

Express Application is automatically created based on the service classes passed to the Nimble.

### Client

Client service proxy is automatically created based on the service classes passed to the Nimble.

### Automatic JS/TS Client generation

`nimbly-client` package can be used to auto-generate client service files for the existing API.

### Interceptors

Both Server and Client support defining interceptors. Most common use case for interceptors is handling Authorization, where the client sends a secret with an identity and the server validates it.

### Automatic OpenAPI docs

Server automatically builds [OpenAPI](https://www.openapis.org/) documentation, and serves [SwaggerUI](https://swagger.io/) on route `/explorer`.

## Next steps

- [Server installation](../02-Server/server-installation.md)
- [Client installation](../03-Client/client-installation.md)
