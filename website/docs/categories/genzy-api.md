---
title: GenzyApi
sidebar_position: 8
slug: /genzy-api/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What GenzyApi is

GenzyApi is responsible for automatically creating a [RestAPI](https://en.wikipedia.org/wiki/Representational_state_transfer) from a set of [GenzyContainers](genzy-container.md).

It is also responsible for automatically building [OpenAPI](https://www.openapis.org/) documentation, and serving [SwaggerUI](https://swagger.io/) on route `/explorer`.

## Creating an API

### From Plain Local Services

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { GenzyContainer, GenzyApi } = require("@genzy/api");

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

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="js" label="ES modules" default>

```js
import { GenzyContainer, GenzyApi } from "@genzy/api";

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

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="ts" label="TypeScript" default>

```ts
import { GenzyContainer, GenzyApi } from "@genzy/api";

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

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
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
const { GenzyContainer, GenzyApi } = require("@genzy/api");

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
}

const usersGenzyContainer = new GenzyContainer().addRemoteServices(
  "http://localhost:3000",
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="js" label="ES modules" default>

```js
import { GenzyContainer, GenzyApi } from "@genzy/api";

class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
}

const usersGenzyContainer = new GenzyContainer().addRemoteServices(
  "http://localhost:3000",
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="ts" label="TypeScript" default>

```ts
import { GenzyContainer, GenzyApi } from "@genzy/api";

class UserService {
  async createUser(user): Promise<any> {}
}

class AccountService {
  async getAllAccounts(): Promise<any[]> {}
}

const usersGenzyContainer = new GenzyContainer().addRemoteServices(
  "http://localhost:3000",
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

  </TabItem>
</Tabs>

![img](/images/plain_local.png)

### From Configured Local Services

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { GenzyContainer, GenzyApi } = require("@genzy/api");

class UserService {
  $genzy = {
    path: "/users",
    createUser: {
      httpMethod: "POST",
      path: "/",
      params: [{ name: "user", source: "body" }],
    },
  };
  async createUser(user) {
    return user;
  }
}

class AccountService {
  $genzy = {
    path: "/accounts",
    getAllAccounts: {
      method: "GET",
      path: "/",
    },
  };
  async getAllAccounts() {
    return [];
  }
}

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="js" label="ES modules" default>

```js
import { GenzyContainer, GenzyApi } from "@genzy/api";

class UserService {
  $genzy = {
    path: "/users",
    createUser: {
      httpMethod: "POST",
      path: "/",
      params: [{ name: "user", source: "body" }],
    },
  };
  async createUser(user) {
    return user;
  }
}

class AccountService {
  $genzy = {
    path: "/accounts",
    getAllAccounts: {
      method: "GET",
      path: "/",
    },
  };
  async getAllAccounts() {
    return [];
  }
}

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

</TabItem>
  <TabItem value="ts" label="TypeScript" default>

```ts
import {
  GenzyContainer,
  GenzyApi,
  Controller,
  Get,
  Post,
  Body,
} from "@genzy/api";

@Controller("/users")
class UserService {
  @Post()
  async createUser(@Body() user): Promise<any> {
    return user;
  }
}

@Controller("/accounts")
class AccountService {
  @Get()
  async getAllAccounts(): Promise<any[]> {
    return [];
  }
}

const usersGenzyContainer = new GenzyContainer().addLocalServices(
  UserService,
  AccountService
);

const app = new GenzyApi().from(usersGenzyContainer);
app.listen(3000);
```

  </TabItem>
</Tabs>

![img](/images/configured_local.png)
