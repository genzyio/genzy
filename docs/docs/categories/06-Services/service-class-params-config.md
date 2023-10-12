---
title: Parameter Configuration
sidebar_position: 3
slug: /service-class-params-config/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you'd like the service methods to be able to receive [query](https://en.wikipedia.org/wiki/Query_string) and/or [path](https://rapidapi.com/blog/api-glossary/parameters/path/) parameters, you can customize them in a `$nimbly` property.

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
      path: '/',
      params: [
        { source: 'query', name: "pageNumber" },
        { source: 'query', name: "pageSize" },
      ]
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id',
      params: [
        { source: 'query', name: "includeDetails" }
        { source: 'path', name: 'id' },
      ]
    },
    add: {
      httpMethod: 'POST',
      path: '/',
      params: [
        { source: 'body', name: 'example' }
      ]
    },
    update: {
      httpMethod: 'PUT',
      path: '/:id',
      params: [
        { source: 'path', name: 'id' },
        { source: 'body', name: 'example' }
      ]
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id',
      params: [
        { source: 'path', name: 'id' },
      ]
    },
  }
  
  async getAll(pageNumber, pageSize) {
    return [];
  }
  async getById(includeDetails, id) {
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
    path: '/',
    getAll: {
      httpMethod: 'GET',
      path: '/',
      params: [
        { source: 'query', name: "pageNumber" },
        { source: 'query', name: "pageSize" },
      ]
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id',
      params: [
        { source: 'query', name: "includeDetails" },
        { source: 'path', name: 'id' },
      ]
    },
    add: {
      httpMethod: 'POST',
      path: '/',
      params: [
        { source: 'body', name: 'example' }
      ]
    },
    update: {
      httpMethod: 'PUT',
      path: '/:id',
      params: [
        { source: 'path', name: 'id' },
        { source: 'body', name: 'example' }
      ]
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id',
      params: [
        { source: 'path', name: 'id' },
      ]
    },
  }
  
  async getAll(pageNumber, pageSize) {
    return [];
  }
  async getById(includeDetails, id) {
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
import { Controller, Get, Post, Put, Delete, Query, Path, Body } from "nimbly-client"; // or nimbly-api

@Controller('/')
class ExampleService {
  @Get()
  async getAll(@Query('pageNumber') pageNumber: number, @Query('pageSize') pageSize: number): Promise<any[]> {
    return [];
  }
  @Get('/:id')
  async getById(@Query('includeDetails') includeDetails: boolean, @Path('id') id: string): Promise<any> {
    return {};
  }
  @Post()
  async add(@Body() example: any): Promise<any> {
    return example;
  }
  @Put('/:id')
  async update(@Path('id') id: string, @Body() example: any): Promise<any> {
    return example;
  }
  @Delete('/:id')
  async delete(@Path('id') id: string): Promise<any> {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

:::important
Configuration must be used both on the client and the server side, since it is used for telling `N1mbly` how and where to send the requests, or register the API routes.
:::