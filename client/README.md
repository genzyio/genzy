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

## Interceptors

```js
// Intercept all service calls
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptAllCalls(({setHeader, getHeader, setBody, getBody}) => {
    setHeader('Authorization', 'Bearer <token>');
  });

// Intercept only specific method calls
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptCalls({
    userService: {
      getTest({setHeader, getHeader, setBody, getBody}) {
        setBody({ ...getBody(), timestamp: new Date() });
      }
    }
  });

// Define interceptors with an interceptor class
class UserServiceCallInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setHeader('classCallInterceptor', 'Works!')
  }
}
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptCalls({
    userService: UserServiceCallInterceptor
  });

// Intercept all service results
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptAllResults(({setHeader, getHeader, setBody, getBody}) => {
    validateBody(getBody());
    setToken(getHeader('Token'));
  });

// Intercept only specific method results
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptResults({
    userService: {
      getTest({setHeader, getHeader, setBody, getBody}) {
        setBody({ ...getBody(), count: getBody().items.length });
      }
    }
  });

// Define interceptors with an interceptor class
class UserServiceResultInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setHeader('classResultInterceptor', 'Works!')
  }
}
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptResults({
    userService: UserServiceResultInterceptor
  });
```

# Steps for publishing new version
1. `npm run prepublish`
2. `npm version major/minor/patch`
3. `npm publish`