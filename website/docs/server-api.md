---
title: Server API
sidebar_label: API
sidebar_position: 1
slug: /server-api/
---

## Reference

The following is the `GenzyApi` class with all method signatures.

```ts
export class GenzyApi {
  constructor();
  constructor(options: {app?: Application, genzyInfo?: GenzyInfo, basePath?: string});

  public intercept(customInterceptors: CustomInterceptors<InterceptorCallback>): GenzyApi;
  public interceptAfter(customInterceptors: CustomInterceptors<InterceptorCallback>): GenzyApi;
  public interceptAll(callback: InterceptorCallback): GenzyApi;
  public interceptAllAfter(callback: InterceptorCallback): GenzyApi;
  public withErrors(errors: ErrorRegistry): GenzyApi;
  public from(containers: GenzyContainer[]): Application;
}
```

### new GenzyApi(options)

- Creates a new instance of GenzyApi.

- `options` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- - `app?` [`<Application>`](http://expressjs.com/en/4x/api.html#app)
- - `genzyInfo?` [`<GenzyInfo>`](#genzyinfo)
- - `basePath?` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### genzyApi.from(containers)

- Creates a new [Express Application](http://expressjs.com/en/4x/api.html#app) from a set of GenzyContainers.

- `nimbles` [`<Array>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

### genzyApi.intercept(interceptors)

- Registers a set of custom [API interceptors](#interceptorcallback) that execute `before` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### genzyApi.interceptAfter(interceptors)

- Registers a set of custom [API interceptors](#interceptorcallback) that execute `after` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### genzyApi.interceptAll(callback)

- Registers a custom [API interceptor](#interceptorcallback) that executes `before` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### genzyApi.interceptAllAfter(callback)

- Registers a custom [API interceptor](#interceptorcallback) that executes `after` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### genzyApi.withErrors(errorRegistry)

- Registers a set of custom error status codes that set the response status based on the error that is thrown.

- `errorRegistry` [`<ErrorRegistry>`](#errorregistry)

## Types

### GenzyInfo

```ts
type GenzyInfo = {
  version?: string;
  name?: string;
  description?: string;
  basePath?: string;
}
```

### InterceptorCallback

```ts
type InterceptorCallback = (req: Request, res: Response, next: NextFunction) => any;
```

### CustomInterceptors

```ts
type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback
  }
};
```

### ErrorRegistry

```ts
type ErrorRegistry = { [key: string]: number };
```
