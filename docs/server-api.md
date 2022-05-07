---
title: Server API
sidebar_label: API
sidebar_position: 1
slug: /server-api/
---

## Reference

The following is the `NimblyApi` class with all method signatures.

```ts
export class NimblyApi {
  constructor();
  constructor(options: {app?: Application, nimblyInfo?: NimblyInfo, basePath?: string});

  public intercept(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi;
  public interceptAfter(customInterceptors: CustomInterceptors<InterceptorCallback>): NimblyApi;
  public interceptAll(callback: InterceptorCallback): NimblyApi;
  public interceptAllAfter(callback: InterceptorCallback): NimblyApi;
  public withErrors(errors: ErrorRegistry): NimblyApi;
  public from(...nimbles: Nimble[]): Application;
}
```

### new NimblyApi(options)

- Creates a new instance of NimblyApi.

- `options` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- - `app?` [`<Application>`](http://expressjs.com/en/4x/api.html#app)
- - `nimblyInfo?` [`<NimblyInfo>`](#nimblyinfo)
- - `basePath?` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### nimblyApi.from(nimbles)

- Creates a new [Express Application](http://expressjs.com/en/4x/api.html#app) from a set of Nimbles.

- `nimbles` [`<Array>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

### nimblyApi.intercept(interceptors)

- Registers a set of custom [API interceptors](#interceptorcallback) that execute `before` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### nimblyApi.interceptAfter(interceptors)

- Registers a set of custom [API interceptors](#interceptorcallback) that execute `after` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### nimblyApi.interceptAll(callback)

- Registers a custom [API interceptor](#interceptorcallback) that executes `before` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### nimblyApi.interceptAllAfter(callback)

- Registers a custom [API interceptor](#interceptorcallback) that executes `after` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### nimblyApi.withErrors(errorRegistry)

- Registers a set of custom error status codes that set the response status based on the error that is thrown.

- `errorRegistry` [`<ErrorRegistry>`](#errorregistry)

## Types

### NimblyInfo

```ts
type NimblyInfo = {
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
