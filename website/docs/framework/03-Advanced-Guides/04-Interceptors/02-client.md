---
title: Client Interceptors
---

## Client Interceptors

A mechanism for intercepting client API calls and it's results. It can be used for things like setting custom headers, parsing the response body, etc.

```ts
// Intercept all service calls
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptAllCalls(({ setHeader, getHeader, setBody, getBody }) => {
    setHeader("Authorization", "Bearer <token>");
  });

// Intercept only specific method calls
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptCalls({
    accountController: {
      create({ setHeader, getHeader, setBody, getBody }) {
        setBody({ ...getBody(), timestamp: new Date() });
      },
    },
  });

// Define interceptors with an interceptor class
class AccountControllerCallInterceptor {
  create({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classCallInterceptor", "Works!");
  }
}
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptCalls({
    accountController: AccountControllerCallInterceptor,
  });

// Intercept all service results
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptAllResults(({ setHeader, getHeader, setBody, getBody }) => {
    validateBody(getBody());
    setToken(getHeader("Token"));
  });

// Intercept only specific method results
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptResults({
    accountController: {
      create({ setHeader, getHeader, setBody, getBody }) {
        setBody({ ...getBody(), count: getBody().items.length });
      },
    },
  });

// Define interceptors with an interceptor class
class AccountControllerResultInterceptor {
  create({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classResultInterceptor", "Works!");
  }
}
const container = new GenzyContainer()
  .addRemoteService(UserService, host)
  .interceptResults({
    accountController: AccountControllerResultInterceptor,
  });
```
