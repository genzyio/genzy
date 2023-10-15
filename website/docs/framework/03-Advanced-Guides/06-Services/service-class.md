---
title: Service class
sidebar_position: 1
slug: /service-class/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What Service class is

Service class is a JavaScript class that implements an arbitrary piece of business logic. It's methods can have parameters, and can also return results.

Genzy can generate a Web API or an HTTP Client from any Service Class.

## Plain

Plain JavaScript classes can be used.

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
class ExampleService {
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
class ExampleService {
  async getAll(): Promise<any[]> {
    return [];
  }
  async getById(id: string): Promise<any> {
    return {};
  }
  async add(example: any): Promise<any> {
    return example;
  }
  async update(example: any): Promise<any> {
    return example;
  }
  async delete(id: string): Promise<any> {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

## Configured

If you'd like the service, and its methods to be registered on a different route path from the default ones, you can customize them in a `$genzy` property.

If you're using [TypeScript](https://www.typescriptlang.org/) you can define configuration using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

:::note
If you're using decorators, make sure that you've set `"experimentalDecorators"` option to `true` in your `tsconfig.json` file.
:::

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
class ExampleService {
  $genzy = {
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
  $genzy = {
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
import { Controller, Get, Post, Put, Delete } from "@genzy/client"; // or @genzy/api

@Controller('/')
class ExampleService {
  @Get()
  async getAll(): Promise<any[]> {
    return [];
  }
  @Get('/:id')
  async getById(id: string): Promise<any> {
    return [];
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

:::important
Configuration must be used both on the client and the server side, since it is used for telling `Genzy` how and where to send the requests, or register the API routes.
:::