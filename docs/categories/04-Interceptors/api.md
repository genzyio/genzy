---
title: API Interceptors
sidebar_position: 3
slug: /api-interceptors/
---

Here is the list of API interceptor definition examples.

### Intercept All Before

```js
// Intercept all service handlers before they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAll((req: Request, res: Response, next: NextFunction) => {
    if(isTokenValid(req.headers.Authorization)) next();
    else res.sendStatus(401);
  })
  .from(usersNimble);
```

### Intercept Specific Before

```js
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
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .intercept({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersNimble);
```

### Intercept All After

```js
// Intercept all service handlers after they are called
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
    res.body({ message: "Hello from Nimbly." });
  })
  .from(usersNimble);
```

### Intercept Specific After

```js
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
const usersNimble = new Nimble().ofLocal(UserService);
const app = new NimblyApi()
  .interceptAfter({
    userService: {
      createUser: UserServiceInterceptor
    }
  })
  .from(usersNimble);
```