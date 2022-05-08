---
title: Service class
sidebar_position: 5
slug: /service-class/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What Service class is

Service class is a JavaScript class that implements some arbitrary piece of business logic. It's methods can have parameters, and can also return results.

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
  async update(id, example) {
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
  async update(id, example) {
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
  async getAll(): any[] {
    return [];
  }
  async getById(id: string): any {
    return [];
  }
  async add(example: any): any {
    return example;
  }
  async update(id: string, example: any): any {
    return example;
  }
  async delete(id: string): any {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

## Configured

If you'd like the service, and its methods to be registered on a different route path from the default ones, you can customize them in a `$nimbly` property.

If you're using [TypeScript](https://www.typescriptlang.org/) you can define configuration using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

:::note
If you're using decorators, make sure that you've set `"experimentalDecorators"` option to `true` in your `tsconfig.json` file.
:::

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
class ExampleService {
  $nimbly = {
    rootPath: '/',
    getAll: {
      method: 'GET',
      path: '/'
    },
    getById: {
      method: 'GET',
      path: '/:id'
    },
    add: {
      method: 'POST',
      path: '/',
      body: true
    },
    update: {
      method: 'PUT',
      path: '/:id',
      body: true
    },
    delete: {
      method: 'DELETE',
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
  async update(id, example) {
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
    rootPath: '/',
    getAll: {
      method: 'GET',
      path: '/'
    },
    getById: {
      method: 'GET',
      path: '/:id'
    },
    add: {
      method: 'POST',
      path: '/',
      body: true
    },
    update: {
      method: 'PUT',
      path: '/:id',
      body: true
    },
    delete: {
      method: 'DELETE',
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
  async update(id, example) {
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
import { Service, Get, Post, Put, Delete } from "nimbly-client"; // or nimbly-api

@Service('/')
class ExampleService {
  @Get()
  async getAll(): any[] {
    return [];
  }
  @Get('/:id')
  async getById(id: string): any {
    return [];
  }
  @Post()
  async add(example: any): any {
    return example;
  }
  @Put('/:id')
  async update(id: string, example: any): any {
    return example;
  }
  @Delete('/:id')
  async delete(id: string): any {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

:::important
Configuration must be used both on the client and the server side, since it is used for telling `Nimbly` how and where to send the requests, or register the API routes.
:::