# Nimbly Server

[![NPM](https://nodei.co/npm/nimbly-api.png)](https://nodei.co/npm/nimbly-api/)

# Getting Started

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

# Steps for publishing new version
1. `npm run prepublish`
2. `npm version major/minor/patch`
3. `npm publish`