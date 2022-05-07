---
title: Server Installation
sidebar_label: Installation
sidebar_position: 1
slug: /server-installation/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites

Please make sure that [Node.js](https://nodejs.org/en/) is installed on your system. The current Long Term Support (LTS) release is an ideal starting point, see [here](https://github.com/nodejs/Release#release-schedule).

:::info

At least Node.js 10 is needed, older versions are not supported anymore.

:::

## Installation

To install the latest release:

<Tabs groupId="pm">
  <TabItem value="npm" label="NPM" default>

```sh
npm install nimbly-api
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add nimbly-api
```
  </TabItem>
</Tabs>

To install a specific version:

<Tabs groupId="pm">
  <TabItem value="npm" label="NPM" default>

```sh
npm install nimbly-api@version
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add nimbly-api@version
```

  </TabItem>
</Tabs>

## Miscellaneous

### Dependency tree

A basic installation of the server includes 23 packages:

```
└─┬ socket.io@4.5.0
  ├─┬ accepts@1.3.8
  │ ├─┬ mime-types@2.1.35
  │ │ └── mime-db@1.52.0
  │ └── negotiator@0.6.3
  ├── base64id@2.0.0
  ├─┬ debug@4.3.4
  │ └── ms@2.1.2
  ├─┬ engine.io@6.2.0
  │ ├── @types/cookie@0.4.1
  │ ├── @types/cors@2.8.12
  │ ├── @types/node@17.0.26
  │ ├── accepts@1.3.8 deduped
  │ ├── base64id@2.0.0 deduped
  │ ├── cookie@0.4.2
  │ ├─┬ cors@2.8.5
  │ │ ├── object-assign@4.1.1
  │ │ └── vary@1.1.2
  │ ├── debug@4.3.4 deduped
  │ ├─┬ engine.io-parser@5.0.3
  │ │ └── @socket.io/base64-arraybuffer@1.0.2
  │ └─┬ ws@8.2.3
  │   ├── UNMET OPTIONAL DEPENDENCY bufferutil@^4.0.1
  │   └── UNMET OPTIONAL DEPENDENCY utf-8-validate@^5.0.2
  ├── socket.io-adapter@2.4.0
  └─┬ socket.io-parser@4.0.4
    ├── @types/component-emitter@1.2.11
    ├── component-emitter@1.3.0
    └── debug@4.3.4 deduped
```