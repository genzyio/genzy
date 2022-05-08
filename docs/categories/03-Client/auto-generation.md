---
title: Auto Generation
sidebar_label: Auto Generation
sidebar_position: 3
slug: /auto-generation/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites

You need to have [installed](client-installation.md) the `nimbly-client` library in your project.

## Syntax

The syntax is simple, you need to run the `nimbly-client` library and pass the following arguments:

- `command` 
- - `generate` - generates the TypeScript client.
- - `generate-js` - generates the JavaScript client.
- - `log` - just fetches the meta info from the url, good for testing.
- `url` - the url of the Nimbly deployment.
- `output-dir` - the path of the directory (existing or new) in which the client files will be stored.

## Generating the Client

### TypeScript

```sh
node node_modules/nimbly-client/build generate http://localhost:3000 ./path/to/output/dir/
```

### JavaScript

```sh
node node_modules/nimbly-client/build generate-js http://localhost:3000 ./path/to/output/dir/
```