# Nimbly

A simple JavaScript framework that puts the focus on the business logic and problems from the domain.

[![NPM](https://nodei.co/npm/@n1mbly/client.png)](https://nodei.co/npm/@n1mbly/client/)
[![NPM](https://nodei.co/npm/@n1mbly/api.png)](https://nodei.co/npm/@n1mbly/api/)

# Getting Started

### Setting up the server:

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
  async createAccount({ username, firstName, lastName, email }) {
    // logic for adding the account
    const newAccount = { id: 1, username };
    // call another service
    this.userService.createUser({
      accountId: newAccount.id,
      firstName,
      lastName,
      email,
    });
    return newAccount;
  }
}
```

4. Create a Nimble of services

```js
import { Nimble } from "@n1mbly/api";

const usersNimble = new Nimble().ofLocal(UserService).andLocal(AccountService);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();
```

5. Create the NimblyApi

```js
import { NimblyApi } from "@n1mbly/api";

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
2. `npm i -S @n1mbly/client`
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
import { Nimble } from "@n1mbly/client";

const host = "http://localhost:3000";

const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .andRemote(AccountService, host);

// The instances are available for custom usage
const { userService, accountService } = usersNimble.services();

// Use the services
accountService
  .createAccount({
    username: "test",
    email: "test@test.com",
    firstName: "Test",
    lastName: "Test",
  })
  .then((newAccount) => console.log(newAccount)) // created account from server
  .catch((error) => console.log(error));

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

## Client Interceptors

```js
// Intercept all service calls
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptAllCalls(({ setHeader, getHeader, setBody, getBody }) => {
    setHeader("Authorization", "Bearer <token>");
  });

// Intercept only specific method calls
const usersNimble = new Nimble().ofRemote(UserService, host).interceptCalls({
  userService: {
    getTest({ setHeader, getHeader, setBody, getBody }) {
      setBody({ ...getBody(), timestamp: new Date() });
    },
  },
});

// Define interceptors with an interceptor class
class UserServiceCallInterceptor {
  getTest({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classCallInterceptor", "Works!");
  }
}
const usersNimble = new Nimble().ofRemote(UserService, host).interceptCalls({
  userService: UserServiceCallInterceptor,
});

// Intercept all service results
const usersNimble = new Nimble()
  .ofRemote(UserService, host)
  .interceptAllResults(({ setHeader, getHeader, setBody, getBody }) => {
    validateBody(getBody());
    setToken(getHeader("Token"));
  });

// Intercept only specific method results
const usersNimble = new Nimble().ofRemote(UserService, host).interceptResults({
  userService: {
    getTest({ setHeader, getHeader, setBody, getBody }) {
      setBody({ ...getBody(), count: getBody().items.length });
    },
  },
});

// Define interceptors with an interceptor class
class UserServiceResultInterceptor {
  getTest({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classResultInterceptor", "Works!");
  }
}
const usersNimble = new Nimble().ofRemote(UserService, host).interceptResults({
  userService: UserServiceResultInterceptor,
});
```

## API Interceptors

```js
// Intercept all service handlers before they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if (isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .from(usersNimble);

// Intercept specific service handlers before they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .intercept({
    userService: {
      createUser: (req: Request, res: Response, next: NextFunction) => {
        if (isAdminUser(req.headers.Authorization)) next();
        else res.sendStatus(401);
      },
    },
  })
  .from(usersNimble);

// Intercept specific service handlers before they are called with Interceptor class
class UserServiceInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    if (isAdminUser(req.headers.Authorization)) next();
    else res.sendStatus(401);
  }
}
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .intercept({
    userService: {
      createUser: UserServiceInterceptor,
    },
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
      },
    },
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
      createUser: UserServiceInterceptor,
    },
  })
  .from(usersNimble);
```

## API Error Status Code Mappings

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

## Roadmap

- Implement Open API docs generation.
- Implement client generation CLI from meta info that is fetched from the API.
- Support for defining custom paths and params.
