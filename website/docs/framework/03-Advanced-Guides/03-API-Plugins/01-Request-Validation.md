### Adding validation of API requests

- Zod validation that registers interceptors

1. `npm i -S genzy-zod-validation`

```ts
import { Plugin as GenzyZodValidationPlugin } from "genzy-zod-validation";

// ...

const app = new GenzyApi()
  .addPlugin(new GenzyZodValidationPlugin())
  .buildAppFrom(controllers);

// now types of request parameters (path, query and body) get validated
```
