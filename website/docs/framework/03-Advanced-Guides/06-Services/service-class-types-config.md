---
title: Types Configuration
sidebar_position: 4
slug: /service-class-types-config/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you'd like `Genzy` to be able to generate a detailed [OpenAPI](https://www.openapis.org/) documentation, with [SwaggerUI](https://swagger.io/) that includes [Type Definitions](https://swagger.io/docs/specification/data-models/data-types/), you can define types in a `$genzy` property.

If you're using [TypeScript](https://www.typescriptlang.org/) you can define configuration using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

:::note
If you're using decorators, make sure that you've set `"experimentalDecorators"` option to `true` in your `tsconfig.json` file.
:::

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const exampleTypeDefinition = {
  $typeName: "Example",
  $isArray: false,
  name: "string",
  age: "number"
};

const exampleArrayTypeDefinition = {
  ...exampleTypeDefinition,
  $isArray: true,
};

class ExampleService {
  $genzy = {
    path: '/',
    getAll: {
      httpMethod: 'GET',
      path: '/',
      params: [
        { source: 'query', name: "pageNumber", type: 'string' },
        { source: 'query', name: "pageSize", type: 'string' },
      ],
      result: exampleArrayTypeDefinition
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id',
      params: [
        { source: 'query', name: "includeDetails", type: 'boolean' }
        { source: 'path', name: 'id', type: 'string' },
      ],
      result: exampleTypeDefinition
    },
    add: {
      httpMethod: 'POST',
      path: '/',
      params: [
        { source: 'body', name: 'example', type: exampleTypeDefinition }
      ],
      result: exampleTypeDefinition
    },
    update: {
      httpMethod: 'PUT',
      path: '/:id',
      params: [
        { source: 'path', name: 'id', type: 'string' },
        { source: 'body', name: 'example', type: exampleTypeDefinition }
      ],
      result: exampleTypeDefinition
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id',
      params: [
        { source: 'path', name: 'id', type: 'string' },
      ],
      result: exampleTypeDefinition
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
const exampleTypeDefinition = {
  $typeName: "Example",
  $isArray: false,
  name: "string",
  age: "number"
};

const exampleArrayTypeDefinition = {
  ...exampleTypeDefinition,
  $isArray: true,
};

class ExampleService {
  $genzy = {
    path: '/',
    getAll: {
      httpMethod: 'GET',
      path: '/',
      params: [
        { source: 'query', name: "pageNumber", type: 'string' },
        { source: 'query', name: "pageSize", type: 'string' },
      ],
      result: exampleArrayTypeDefinition
    },
    getById: {
      httpMethod: 'GET',
      path: '/:id',
      params: [
        { source: 'query', name: "includeDetails", type: 'boolean' }
        { source: 'path', name: 'id', type: 'string' },
      ],
      result: exampleTypeDefinition
    },
    add: {
      httpMethod: 'POST',
      path: '/',
      params: [
        { source: 'body', name: 'example', type: exampleTypeDefinition }
      ],
      result: exampleTypeDefinition
    },
    update: {
      httpMethod: 'PUT',
      path: '/:id',
      params: [
        { source: 'path', name: 'id', type: 'string' },
        { source: 'body', name: 'example', type: exampleTypeDefinition }
      ],
      result: exampleTypeDefinition
    },
    delete: {
      httpMethod: 'DELETE',
      path: '/:id',
      params: [
        { source: 'path', name: 'id', type: 'string' },
      ],
      result: exampleTypeDefinition
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
import { Controller, Get, Post, Put, Delete, Query, Path, Body, string, number, boolean, type, Returns, ReturnsArrayOf } from "@genzy/client"; // or @genzy/api

class Example {
  @string() name: string;
  @int()age: number;
}

@Controller('/')
class ExampleService {
  @Get()
  @ReturnsArrayOf(Example)
  async getAll(@Query('pageNumber') @int()pageNumber: number, @Query('pageSize') @int()pageSize: number): Promise<Example[]> {
    return [];
  }
  @Get('/:id')
  @Returns(Example)
  async getById(@Query('includeDetails') @boolean()includeDetails: boolean, @Path('id') @string() id: string): Promise<Example> {
    return {};
  }
  @Post()
  @Returns(Example)
  async add(@Body() @type(Example) example: Example): Promise<Example> {
    return example;
  }
  @Put('/:id')
  @Returns(Example)
  async update(@Path('id') @string() id: string, @Body() @type(Example) example: Example): Promise<Example> {
    return example;
  }
  @Delete('/:id')
  @Returns(Example)
  async delete(@Path('id') @string() id: string): Promise<Example> {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

:::important
Types configuration is used at the server side, since it is used for telling `Genzy` how to set up a detailed [OpenAPI](https://www.openapis.org/) documentation, with [SwaggerUI](https://swagger.io/) that includes [Type Definitions](https://swagger.io/docs/specification/data-models/data-types/).
:::