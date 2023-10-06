# N1mbly API

[![NPM](https://nodei.co/npm/@n1mbly/api.png)](https://nodei.co/npm/@n1mbly/api/)

# Getting Started

1. `npm init -y`
2. `npm i -S @n1mbly/api`
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
import { Nimble } from '@n1mbly/api';

const usersNimble = new Nimble()
  .ofLocal(UserService)
  .andLocal(AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();
```

5. Create the NimblyApi
```js
import { NimblyApi } from '@n1mbly/api';

const app = new NimblyApi().from(usersNimble);

app.listen(3000);
```

```bash
# 3 routes are registered
# POST /api/user-service/create-user
# GET /api/account-service/get-all-accounts
# POST /api/account-service/create-account
```

## Interceptors

```js
// Intercept all service handlers before they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if(isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .from(usersNimble);

// Intercept specific service handlers before they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .intercept({
    userService: {
      createUser: (req: Request, res: Response, next: NextFunction) => {
        if(isAdminUser(req.headers.Authorization)) next();
        else res.sendStatus(401);
      }
    }
  })
  .from(usersNimble);

// Intercept specific service handlers before they are called with Interceptor class
class UserServiceInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    if(isAdminUser(req.headers.Authorization)) next();
    else res.sendStatus(401);
  }
}
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .intercept({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersNimble);

// Intercept all service handlers after they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
    res.body({ message: "Hello from Nimbly." });
  })
  .from(usersNimble);

// Intercept specific service handlers after they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAfter({
    userService: {
      createUser: (req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      }
    }
  })
  .from(usersNimble);

// Intercept specific service handlers after they are called with Interceptor class
class UserServiceInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    res.status(201);
    next();
  }
}
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAfter({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersNimble);
```

## Error Status Code Mappings
```js
class BadLogicError extends Error {
  name = "BadLogicError";
  constructor(message?: string) {
    super(message);
  }
}
class InternalServerError extends Error {
  name = "InternalServerError";
  constructor(message?: string) {
    super(message);
  }
}
const app = new NimblyApi()
  .withErrors({
    [BadLogicError.name]: 400,
    [InternalServerError.name]: 500,
  })
  .from(usersNimble);
```

# Steps for publishing new version
1. `npm run prepublish`
2. `npm version major/minor/patch`
3. `npm publish`