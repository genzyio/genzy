---
title: CLI Installation
sidebar_label: Installation
sidebar_position: 1
slug: /cli-installation/
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
npm install -g @genzy/cli
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn global add @genzy/cli
```
  </TabItem>
</Tabs>

To install a specific version:

<Tabs groupId="pm">
  <TabItem value="npm" label="NPM" default>

```sh
npm install -g @genzy/cli@version
```

  </TabItem>
  <TabItem value="yarn" label="Yarn">

```sh
yarn global add @genzy/cli@version
```

  </TabItem>
</Tabs>
