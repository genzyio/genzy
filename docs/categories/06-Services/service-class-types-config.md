---
title: Types Configuration
sidebar_position: 4
slug: /service-class-types-config/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

If you'd like `Nimbly` to be able to generate a detailed [OpenAPI](https://www.openapis.org/) documentation, with [SwaggerUI](https://swagger.io/) that includes [Type Definitions](https://swagger.io/docs/specification/data-models/data-types/), you can define types in a `$nimbly` property.

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
  $nimbly = {
    types: {
      getAll: [
        { index: 0, type: "number" },
        { index: 1, type: "number" },
      ],
      getById: [
        { index: 0, type: "boolean" },
        { index: 1, type: "string" },
      ],
      add: [
        {
          index: 0,
          type: {
            $typeName: "Example",
            name: "string",
            age: "number"
          }
        }
      ],
      update: [
        { index: 0, type: "string" },
        {
          index: 1,
          type: exampleTypeDefinition
        }
      ],
      delete: [
        { index: 0, type: "string" }
      ],
    },
    returnTypes: {
      getAll: exampleArrayTypeDefinition,
      getById: exampleTypeDefinition,
      add: exampleTypeDefinition,
      update: exampleTypeDefinition,
      delete: exampleTypeDefinition,
    },
    rootPath: '/',
    getAll: {
      method: 'GET',
      path: '/',
      query: [
        { index: 0, name: "pageNumber" },
        { index: 1, name: "pageSize" },
      ]
    },
    getById: {
      method: 'GET',
      path: '/:id',
      query: [ { index: 0, name: "includeDetails" } ]
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
  $nimbly = {
    types: {
      getAll: [
        { index: 0, type: "number" },
        { index: 1, type: "number" },
      ],
      getById: [
        { index: 0, type: "boolean" },
        { index: 1, type: "string" },
      ],
      add: [
        {
          index: 0,
          type: {
            $typeName: "Example",
            name: "string",
            age: "number"
          }
        }
      ],
      update: [
        { index: 0, type: "string" },
        {
          index: 1,
          type: exampleTypeDefinition
        }
      ],
      delete: [
        { index: 0, type: "string" }
      ],
    },
    returnTypes: {
      getAll: exampleArrayTypeDefinition,
      getById: exampleTypeDefinition,
      add: exampleTypeDefinition,
      update: exampleTypeDefinition,
      delete: exampleTypeDefinition,
    },
    rootPath: '/',
    getAll: {
      method: 'GET',
      path: '/',
      query: [
        { index: 0, name: "pageNumber" },
        { index: 1, name: "pageSize" },
      ]
    },
    getById: {
      method: 'GET',
      path: '/:id',
      query: [ { index: 0, name: "includeDetails" } ]
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
import { Service, Get, Post, Put, Delete, Query, string, number, boolean, type, Returns, ReturnsArrayOf } from "nimbly-client"; // or nimbly-api

class Example {
  @string name: string;
  @number age: number;
}

@Service('/')
class ExampleService {
  @Get()
  @ReturnsArrayOf(Example)
  async getAll(@Query('pageNumber') @number pageNumber: number, @Query('pageSize') @number pageSize: number): Promise<Example[]> {
    return [];
  }
  @Get('/:id')
  @Returns(Example)
  async getById(@Query('includeDetails') @boolean includeDetails: boolean, @string id: string): Promise<Example> {
    return {};
  }
  @Post()
  @Returns(Example)
  async add(@type(Example) example: Example): Promise<Example> {
    return example;
  }
  @Put('/:id')
  @Returns(Example)
  async update(@string id: string, @type(Example) example: Example): Promise<Example> {
    return example;
  }
  @Delete('/:id')
  @Returns(Example)
  async delete(@string id: string): Promise<Example> {
    return { id };
  }
}
```

  </TabItem>
</Tabs>

:::important
Types configuration is used at the server side, since it is used for telling `Nimbly` how to set up a detailed [OpenAPI](https://www.openapis.org/) documentation, with [SwaggerUI](https://swagger.io/) that includes [Type Definitions](https://swagger.io/docs/specification/data-models/data-types/).
:::