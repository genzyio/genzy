---
title: API Interceptors
---

## API Interceptors

A mechanism for intercepting API requests and it's results. It can be used for things like validating headers, parsing the request or response body, etc.

```ts
// Intercept all service handlers before they are called
const app = new GenzyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if (isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers before they are called
const container = new GenzyContainer().addLocalService(UserService);
const app = new GenzyApi()
  .intercept({
    accountController: {
      create: (req: Request, res: Response, next: NextFunction) => {
        if (isAdminUser(req.headers.Authorization)) next();
        else res.sendStatus(401);
      },
    },
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers before they are called with Interceptor class
class AccountControllerInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    if (isAdminUser(req.headers.Authorization)) next();
    else res.sendStatus(401);
  }
}
const container = new GenzyContainer().addLocalService(UserService);
const app = new GenzyApi()
  .intercept({
    accountController: {
      create: AccountControllerInterceptor,
    },
  })
  .buildAppFrom(controllers);

// Intercept all service handlers after they are called
const container = new GenzyContainer().addLocalService(UserService);
const app = new GenzyApi()
  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
    res.body({ message: "Hello from Genzy." });
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers after they are called
const container = new GenzyContainer().addLocalService(UserService);
const app = new GenzyApi()
  .interceptAfter({
    accountController: {
      create: (req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      },
    },
  })
  .buildAppFrom(controllers);

// Intercept specific service handlers after they are called with Interceptor class
class AccountControllerInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    res.status(201);
    next();
  }
}
const container = new GenzyContainer().addLocalService(UserService);
const app = new GenzyApi()
  .interceptAfter({
    accountController: {
      create: AccountControllerInterceptor,
    },
  })
  .buildAppFrom(controllers);
```
