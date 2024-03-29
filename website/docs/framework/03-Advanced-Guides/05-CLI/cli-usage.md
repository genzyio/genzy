---
title: CLI Usage
sidebar_label: Usage
sidebar_position: 2
slug: /cli-usage/
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Prerequisites

You need to have [installed](cli-installation.md) the `@genzy/cli` library in your project.

## Syntax

The syntax for generating the client code is simple, you need to run the `genzy -l <language> -h <host> -o <output_dir>` library and pass the following arguments:

`genzy`
- `-h` - for help
- `-l` - language
- - `ts` - generates the TypeScript client.
- - `js` - generates the JavaScript client.
- `-h` - the url of the Genzy deployment.
- `-o` - the path of the directory (existing or new) in which the client files will be stored.

## Generating the Client

### TypeScript

```sh
genzy -l ts -h http://localhost:3000 -o ./path/to/output/dir/
```

### JavaScript

```sh
genzy -l js -h http://localhost:3000 -o ./path/to/output/dir/
```