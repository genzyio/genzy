---
title: Route Configuration
sidebar_position: 2
slug: /service-class-routes-config/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you'd like the service, and its methods to be registered on a different route paths and http methods from the default ones, you can customize them in a `$nimbly` property.

If you're using [TypeScript](https://www.typescriptlang.org/) you can define configuration using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

:::note
If you're using decorators, make sure that you've set `"experimentalDecorators"` option to `true` in your `tsconfig.json` file.
:::

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
class ExampleService {
  $nimbly = {
    path: '/',
    getAll: {
      httpMethod: 'GET',
      path: '/'
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id'
    },
    add: {
      httpMethod: 'POST',
      path: '/'
    },
    update: {
      httpMethod: 'PUT',
      path: '/'
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id'
    },
  }
  
  async getAll() {
    return [];
  }
  async getById(id) {
    return [];
  }
  async add(example) {
    return example;
  }
  async update(example) {
    return example;
  }
  async delete(id) {
    return { id };
  }
}
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
class ExampleService {
  $nimbly = {
    path: '/',
    getAll: {
      httpMethod: 'GET',
      path: '/'
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id'
    },
    add: {
      httpMethod: 'POST',
      path: '/'
    },
    update: {
      httpMethod: 'PUT',
      path: '/'
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id'
    },
  }

  async getAll() {
    return [];
  }
  async getById(id) {
    return [];
  }
  async add(example) {
    return example;
  }
  async update(example) {
    return example;
  }
  async delete(id) {
    return { id };
  }
}
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import { Controller, Get, Post, Put, Delete } from "nimbly-client"; // or nimbly-api

@Controller('/')
class ExampleService {
  @Get()
  async getAll(): Promise<any[]> {
    return [];
  }
  @Get('/:id')
  async getById(id: string): Promise<any> {
    return {};
  }
  @Post()
  async add(example: any): Promise<any> {
    return example;
  }
  @Put()
  async update(example: any): Promise<any> {
    return example;
  }
  @Delete('/:id')
  async delete(id: string): Promise<any> {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

:::info
Using `:parameterName` in the route path registers a positional path parameter.
:::

:::important
Configuration must be used both on the client and the server side, since it is used for telling `Nimbly` how and where to send the requests, or register the API routes.
:::