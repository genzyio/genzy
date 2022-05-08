---
title: NimblyApi
sidebar_position: 7
slug: /nimbly-api/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What NimblyApi is

NimblyApi is responsible for automatically creating a [RestAPI](https://en.wikipedia.org/wiki/Representational_state_transfer) from a set of [Nimbles](nimble.md).

It is also responsible for automatically building [OpenAPI](https://www.openapis.org/) documentation, and serving [SwaggerUI](https://swagger.io/) on route `/explorer`.

## Creating an API

### From Plain Local Services

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { Nimble, NimblyApi } = require('nimbly-api');

class UserService {
  async createUser(user) {
    return user;
  }
}

class AccountService {
  async getAllAccounts() {
    return [];
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

```js
import { Nimble, NimblyApi } from 'nimbly-api';

class UserService {
  async createUser(user) {
    return user;
  }
}

class AccountService {
  async getAllAccounts() {
    return [];
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

```ts
import { Nimble, NimblyApi } from 'nimbly-api';

class UserService {
  async createUser(user): Promise<any> {
    return user;
  }
}

class AccountService {
  async getAllAccounts(): Promise<any[]> {
    return [];
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

![img](/images/plain_local.png)

### From Plain Remote Services

:::info
An API can also be generated from a set of remote services, so that the API acts as an [API Gateway](https://www.nginx.com/learn/api-gateway/).
:::

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { Nimble, NimblyApi } = require('nimbly-api');

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, 'http://localhost:3000')
  .andRemote(AccountService, 'http://localhost:3000');

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
</TabItem>
  <TabItem value="js" label="ES modules" default>

```js
import { Nimble, NimblyApi } from 'nimbly-api';

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, 'http://localhost:3000')
  .andRemote(AccountService, 'http://localhost:3000');

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
</TabItem>
  <TabItem value="ts" label="TypeScript" default>

```ts
import { Nimble, NimblyApi } from 'nimbly-api';

class UserService {
  async createUser(user): Promise<any> {}
}

class AccountService {
  async getAllAccounts(): Promise<any[]> {}
}

const usersNimble = new Nimble()
  .ofRemote(UserService, 'http://localhost:3000')
  .andRemote(AccountService, 'http://localhost:3000');

const app = new NimblyApi().from(usersNimble);
app.listen(3000);
```
  </TabItem>
</Tabs>

![img](/images/plain_local.png)

### From Configured Local Services

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { Nimble, NimblyApi } = require('nimbly-api');

class UserService {
  $nimbly = {
    rootPath: '/users',
    createUser: {
      method: 'POST',
      path: '/',
      body: true
    }
  }
  async createUser(user) {
    return user;
  }
}

class AccountService {
    $nimbly = {
    rootPath: '/accounts',
    getAllAccounts: {
      method: 'GET',
      path: '/'
    }
  }
  async getAllAccounts() {
    return [];
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

```js
import { Nimble, NimblyApi } from 'nimbly-api';

class UserService {
  $nimbly = {
    rootPath: '/users',
    createUser: {
      method: 'POST',
      path: '/',
      body: true
    }
  }
  async createUser(user) {
    return user;
  }
}

class AccountService {
    $nimbly = {
    rootPath: '/accounts',
    getAllAccounts: {
      method: 'GET',
      path: '/'
    }
  }
  async getAllAccounts() {
    return [];
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

```ts
import { Nimble, NimblyApi, Service, Get, Post } from 'nimbly-api';

@Service('/users')
class UserService {
  @Post()
  async createUser(user): Promise<any> {
    return user;
  }
}

@Service('/accounts')
class AccountService {
  @Get()
  async getAllAccounts(): Promise<any[]> {
    return [];
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

![img](/images/configured_local.png)