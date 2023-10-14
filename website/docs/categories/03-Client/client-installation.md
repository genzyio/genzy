---
title: Client Installation
sidebar_label: Installation
sidebar_position: 1
slug: /client-installation/
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
npm install genzy-client
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add genzy-client
```
  </TabItem>
</Tabs>

To install a specific version:

<Tabs groupId="pm">
  <TabItem value="npm" label="NPM" default>

```sh
npm install genzy-client@version
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn add genzy-client@version
```

  </TabItem>
</Tabs>

## Miscellaneous

### Dependency tree

A basic installation of the client includes 2 packages:

```
genzy-client@1.2.3
├── axios@0.24.0
└── blueimp-tmpl@3.20.0
```