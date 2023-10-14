---
title: Client Interceptors
sidebar_position: 4
slug: /client-interceptors/
---
Here is the list of Client interceptor definition examples.

### Intercept All Before

```js
// Intercept all service calls
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptAllCalls(({setHeader, getHeader, setBody, getBody}) => {
    setHeader('Authorization', 'Bearer <token>');
  });
```

### Intercept Specific Before

```js
// Intercept only specific method calls
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptCalls({
    userService: {
      getTest({setHeader, getHeader, setBody, getBody}) {
        setBody({ ...getBody(), timestamp: new Date() });
      }
    }
  });
```

### Intercept Specific Before - Interceptor Class

```js
// Define interceptors with an interceptor class
class UserServiceCallInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setHeader('classCallInterceptor', 'Works!')
  }
}
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptCalls({
    userService: UserServiceCallInterceptor
  });
```

### Intercept All After

```js
// Intercept all service results
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptAllResults(({setHeader, getHeader, setBody, getBody}) => {
    validateBody(getBody());
    setToken(getHeader('Token'));
  });
```

### Intercept Specific After

```js
// Intercept only specific method results
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptResults({
    userService: {
      getTest({setHeader, getHeader, setBody, getBody}) {
        setBody({ ...getBody(), count: getBody().items.length });
      }
    }
  });
```

### Intercept Specific After - Interceptor Class

```js
// Define interceptors with an interceptor class
class UserServiceResultInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setHeader('classResultInterceptor', 'Works!')
  }
}
const usersGenzyContainer = new GenzyContainer()
  .ofRemote(UserService, host)
  .interceptResults({
    userService: UserServiceResultInterceptor
  });
```