# Nimbly Client

[![NPM](https://nodei.co/npm/nimbly-client.png)](https://nodei.co/npm/nimbly-client/)

# Getting started:

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

# Steps for publishing new version
1. `npm run prepublish`
2. `npm version major/minor/patch`
3. `npm publish`