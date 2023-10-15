---
title: Error Mapping
---

## API Custom Error to Status Code Mapping

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
const app = new GenzyApi()
  .withErrors({
    [BadLogicError.name]: 400,
    [InternalServerError.name]: 500,
  })
  .buildAppFrom(controllers);
```
