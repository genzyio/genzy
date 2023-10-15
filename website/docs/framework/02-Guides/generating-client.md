---
title: Generating the client
sidebar_label: Generating the client
sidebar_position: 2
slug: /quickstart/client
---

# Generating the client

Once you've created the API, the client code for accessing it can be automatically generated from the meta information provided by the API.

In your client project:

1. `npm i -S @genzy.io/client`
2. `npm i -g @genzy.io/cli`
3. To generate the client code for accessing the API run:

```bash
genzy -l ts -o ./src/account-client -h http://localhost:3000/api
```

```ts
import { GenzyContainer } from "@genzy.io/client";

const host = "http://localhost:3000";

const container = new GenzyContainer().addRemoteService(
  AccountController,
  host
);

// The instances are available for custom usage
const { accountController } = container.getServices();

// Use the services
accountController
  .createAccount({
    username: "test",
    isAdmin: false,
  })
  .then((newAccount) => console.log(newAccount)) // created account from server
  .catch((error) => console.log(error));
```
