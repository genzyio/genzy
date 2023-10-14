---
title: GenzyContainer
sidebar_position: 7
slug: /nimble/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What Nibmle is

GenzyContainer holds a set of related service classes. It is responsible for handling their lifecycle and managing their dependencies.

GenzyContainer can hold [Local](#local-services) or [Remote](#remote-services) services.

## Local Services

Local services are ones that are running in the same process as GenzyContainer.

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { GenzyContainer } = require("genzy-client"); // or "genzy-api"

class UserService {
  async getAll() {
    return [];
  }
}

class AccountService {
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAll() {
    const accounts = [];
    const users = await this.userService.getAll();
    return users.map(user => ({
      ...user,
      account: accounts.find(acc => acc.id === user.accountId)
    }));
  }
}

// Creating the GenzyContainer 
const container = new GenzyContainer().addLocalServices(UserService, AccountService);

// Getting the services out of the GenzyContainer.
const { accountService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
import { GenzyContainer } from "genzy-client"; // or "genzy-api"

class UserService {
  async getAll() {
    return [];
  }
}

class AccountService {
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAll() {
    const accounts = [];
    const users = await this.userService.getAll();
    return users.map(user => ({
      ...user,
      account: accounts.find(acc => acc.id === user.accountId)
    }));
  }
}

// Creating the GenzyContainer 
const container = new GenzyContainer().addLocalServices(UserService, AccountService);

// Getting the services out of the GenzyContainer.
const { accountService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import { GenzyContainer } from "genzy-client"; // or "genzy-api"

type GenzyContainerServices = {
  userService: UserService;
  accountService: AccountService;
}

class UserService {
  async getAll(): any[] {
    return [];
  }
}

class AccountService {
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAll(): any[] {
    const accounts = [];
    const users = await this.userService.getAll();
    return users.map(user => ({
      ...user,
      account: accounts.find(acc => acc.id === user.accountId)
    }));
  }
}

// Creating the GenzyContainer 
const container = new GenzyContainer().addLocalServices(UserService, AccountService);

// Getting the services out of the GenzyContainer
const { accountService }: GenzyContainerServices = nimble.getAllServices();
```

  </TabItem>
</Tabs>

## Remote Services

Remote services are, as the name suggests, running in a different process, or on a different server. Methods of a remote service, that is in a GenzyContainer do not require any implementation code, but do require the URL of the server they are running on.

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { GenzyContainer } = require("genzy-client"); // or "genzy-api"

class UserService {
  async getAll() {}
}

class AccountService {
  async getAll() {}
}

// Creating the GenzyContainer 
const container = new GenzyContainer()
  .addRemoteServices("http://localhost:3000", UserService, AccountService);

// Getting the services out of the GenzyContainer.
const { accountService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
import { GenzyContainer } from "genzy-client"; // or "genzy-api"

class UserService {
  async getAll() {
    return [];
  }
}

class AccountService {
  async getAll() {}
}

// Creating the GenzyContainer 
const container = new GenzyContainer()
  .addRemoteServices("http://localhost:3000", UserService, AccountService);

// Getting the services out of the GenzyContainer.
const { accountService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import { GenzyContainer } from "genzy-client"; // or "genzy-api"

type GenzyContainerServices = {
  userService: UserService;
  accountService: AccountService;
}

class UserService {
  async getAll(): any[] {}
}

class AccountService {
  async getAll(): any[] {}
}

// Creating the GenzyContainer 
const container = new GenzyContainer()
  .addRemoteServices("http://localhost:3000", UserService, AccountService);

// Getting the services out of the GenzyContainer
const { accountService }: GenzyContainerServices = nimble.getAllServices();
```

  </TabItem>
</Tabs>

GenzyContainer implicitly creates a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for each service that gets the results of method calls over HTTP.