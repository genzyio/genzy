# Nimbly

A simple JavaScript framework that puts the focus on the business logic and problems from the domain.

[![NPM](https://nodei.co/npm/nimbly-client.png)](https://nodei.co/npm/nimbly-client/)
[![NPM](https://nodei.co/npm/nimbly-api.png)](https://nodei.co/npm/nimbly-api/)

# Getting Started

### Setting up the server:

1. `npm init -y`
2. `npm i -S nimbly-api`
3. Implement services
```js
class UserService {
  async createUser(user) {
    // logic for adding the user
    return user;
  }
}

class AccountService {
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
4. Create a Nimble of services
```js
import { Nimble } from 'nimbly-api';

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();
```

5. Create the NimblyApi
```js
import { NimblyApi } from 'nimbly-api';

const app = new NimblyApi().from(usersNimble);

app.listen(3000);
```

```bash
# 3 routes are registered
# POST /api/user-service/create-user
# GET /api/account-service/get-all-accounts
# POST /api/account-service/create-account
```

### Setting up the client:

1. `npm init -y`
2. `npm i -S nimbly-client`
3. Define services
```js
class UserService {
  async createUser(user) {}
}

class AccountService {
  async getAllAccounts() {}
  async createAccount(account) {}
}
```
4. Create a Nimble of remote services
```js
import { Nimble } from 'nimbly-client';

const usersNimble = new Nimble()
  .ofRemote(UserService)
  .andRemote(AccountService);

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

```bash
# 2 requests have been sent
# POST /api/account-service/create-account
#   body: { args: [{
#     username: 'test',
#     email: 'test@test.com',
#     firstName: 'Test',
#     lastName: 'Test',
#   }] }
# GET /api/account-service/get-all-accounts
```
