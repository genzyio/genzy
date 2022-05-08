---
title: Getting Started
slug: /getting-started/
---

[![NPM](https://nodei.co/npm/nimbly-client.png)](https://nodei.co/npm/nimbly-client/)
[![NPM](https://nodei.co/npm/nimbly-api.png)](https://nodei.co/npm/nimbly-api/)

## Setting up the server

1. Initialize the project
```bash
npm init -y
```
2. Install `nimbly-api` library
```bash
npm i -S nimbly-api
```
3. Implement [services](./categories/service-class.md)
```js
class UserService {
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

class AccountService {
  // UserService is automatically injected
  constructor({ userService }) {
    this.userService = userService;
  }

  async getAllAccounts() {
    return [];
  }

  // take accountInfo object as parameter 
  async createAccount({username, firstName, lastName, email}) {
    // logic for adding the account
    const newAccount = {id: 1, username};
    // call another service
    this.userService.createUser({
      accountId: newAccount.id,
      firstName,
      lastName,
      email
    })
    return newAccount;
  }
}
```
4. Create a [Nimble](./categories/nimble.md) of services
```js
import { Nimble } from 'nimbly-api';

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();
```

5. Create the [NimblyApi](./categories/nimbly-api.md)
```js
import { NimblyApi } from 'nimbly-api';

const app = new NimblyApi().from(usersNimble);

app.listen(3000);
```

:::info 3 routes have been registered
- POST /api/user-service/create-user
- GET /api/account-service/get-all-accounts
- POST /api/account-service/create-account
:::

## Setting up the client

1. Initialize the project
```bash
npm init -y
```
2. Install `nimbly-client` library
```bash
npm i -S nimbly-client
```
3. Define [services](./categories/service-class.md)
```js
class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}
```
4. Create a [Nimble](./categories/nimble.md) of remote services
```js
import { Nimble } from 'nimbly-client';

const host = 'http://localhost:3000';

const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .andRemote(AccountService, host);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();

// Use the services
accountService.createAccount({
  username: 'test',
  email: 'test@test.com',
  firstName: 'Test',
  lastName: 'Test',
})
.then(newAccount => console.log(newAccount)) // created account from server
.catch(error => console.log(error));

// Fetch all accounts
const allAccounts = await accountService.getAllAccounts();
```

:::info 2 requests have been sent
- `POST` /api/account-service/create-account
- body: `{ username: 'test', email: 'test@test.com', firstName: 'Test', lastName: 'Test' }`
- `GET` /api/account-service/get-all-accounts
:::
