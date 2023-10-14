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
npm install genzy-api
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add genzy-api
```
  </TabItem>
</Tabs>

To install a specific version:

<Tabs groupId="pm">
  <TabItem value="npm" label="NPM" default>

```sh
npm install genzy-api@version
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add genzy-api@version
```

  </TabItem>
</Tabs>

## Miscellaneous

### Dependency tree

A basic installation of the server includes 4 packages:

```
genzy-api@1.2.3
├── cors@2.8.5
├── express@4.17.1
├── genzy-client@1.2.0
└── swagger-ui-express@4.3.0
```