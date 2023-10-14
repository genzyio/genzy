---
title: Server Initialization
sidebar_label: Initialization
sidebar_position: 2
slug: /server-initialization/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Once you have [installed](server-installation.md) the `genzy-api` library, you can now init the API.

## Initialization

### Standalone

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const { GenzyApi, GenzyContainer } = require('genzy-api');

const container = new GenzyContainer().addLocalServices(/* services */);

const app = new GenzyApi().from(container);

app.listen(3000);
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
import { GenzyApi, GenzyContainer } from 'genzy-api';

const container = new GenzyContainer().addLocalServices(/* services */);

const app = new GenzyApi().from(container);

app.listen(3000);
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import { GenzyApi, GenzyContainer } from 'genzy-api';

const container = new GenzyContainer().addLocalServices(/* services */);

const app = new GenzyApi().from(container);

app.listen(3000);
```

  </TabItem>
</Tabs>

This implicitly starts a [Express Application](http://expressjs.com/en/4x/api.html#app).

### With an existing Express Application

<Tabs groupId="lang">
  <TabItem value="cjs" label="CommonJS" default>

```js
const express = require("express");
const { GenzyApi, GenzyContainer } = require('genzy-api');

const container = new GenzyContainer().addLocalServices(/* services */);

const existingApp = express();

const app = new GenzyApi({ app: existingApp }).from(container);

existingApp.listen(3000);
```

  </TabItem>
  <TabItem value="mjs" label="ES modules">

```js
import * as express from 'express';
import { GenzyApi, GenzyContainer } from 'genzy-api';

const container = new GenzyContainer().addLocalServices(/* services */);

const existingApp = express();

const app = new GenzyApi({ app: existingApp }).from(container);

existingApp.listen(3000);
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```ts
import * as express from 'express';
import { GenzyApi, GenzyContainer } from 'genzy-api';

const container = new GenzyContainer().addLocalServices(/* services */);

const existingApp = express();

const app = new GenzyApi({ app: existingApp }).from(container);

existingApp.listen(3000);
```

  </TabItem>
</Tabs>

:::caution

Using `app.listen(3000)` will not work here, as it creates a new HTTP server.

:::

## Options

The complete list of available options can be found [here](../../server-api.md).
