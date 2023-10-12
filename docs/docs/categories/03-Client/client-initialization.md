---
title: Client Initialization
sidebar_label: Initialization
sidebar_position: 2
slug: /client-initialization/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Once you have [installed](client-installation.md) the `nimbly-client` library, you can now init the API.

## Initialization

### Standalone

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { Nimble } = require("nimbly-client");

class ExampleService {
  async get() {}
}

const nimble = new Nimble().addRemoteService("http://localhost:3000", ExampleService);

const { exampleService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
import { Nimble } from "nimbly-client";

class ExampleService {
  async get() {}
}

const nimble = new Nimble().addRemoteService("http://localhost:3000", ExampleService);

const { exampleService } = nimble.getAllServices();
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import { Nimble } from "nimbly-client";

class ExampleService {
  async get() {}
}

const nimble = new Nimble().addRemoteService("http://localhost:3000", ExampleService);

type NimblyServices = {
  exampleService: ExampleService;
};

const { exampleService }: NimblyServices = nimble.getAllServices();
```

  </TabItem>
</Tabs>

## Options

The complete list of available options can be found [here](../../client-api.md).
