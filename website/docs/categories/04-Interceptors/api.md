---
title: API Interceptors
sidebar_position: 3
slug: /api-interceptors/
---

Here is the list of API interceptor definition examples.

### Intercept All Before

```js
// Intercept all service handlers before they are called
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if(isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .from(usersGenzyContainer);
```

### Intercept Specific Before

```js
// Intercept specific service handlers before they are called
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .intercept({
    userService: {
      createUser: (req: Request, res: Response, next: NextFunction) => {
        if(isAdminUser(req.headers.Authorization)) next();
        else res.sendStatus(401);
      }
    }
  })
  .from(usersGenzyContainer);
```

### Intercept Specific Before - Interceptor Class

```js
// Intercept specific service handlers before they are called with Interceptor class
class UserServiceInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    if(isAdminUser(req.headers.Authorization)) next();
    else res.sendStatus(401);
  }
}
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .intercept({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersGenzyContainer);
```

### Intercept All After

```js
// Intercept all service handlers after they are called
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
    res.body({ message: "Hello from Genzy." });
  })
  .from(usersGenzyContainer);
```

### Intercept Specific After

```js
// Intercept specific service handlers after they are called
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .interceptAfter({
    userService: {
      createUser: (req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      }
    }
  })
  .from(usersGenzyContainer);
```

### Intercept Specific After - Interceptor Class

```js
// Intercept specific service handlers after they are called with Interceptor class
class UserServiceInterceptor {
  createUser(req: Request, res: Response, next: NextFunction) {
    res.status(201);
    next();
  }
}
const usersGenzyContainer = new GenzyContainer().ofLocal(UserService);
const app = new GenzyApi()
  .interceptAfter({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersGenzyContainer);
```