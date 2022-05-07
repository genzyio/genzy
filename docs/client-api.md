---
title: Client API
sidebar_label: API
sidebar_position: 1
slug: /client-api/
---

## Reference

The following is the `Nimble` class with all method signatures.

```ts
export class Nimble {
  constructor();

  public of(type: Constructor): Nimble;
  public ofLocal(type: Constructor): Nimble;
  public andLocal(type: Constructor): Nimble;
  public ofRemote(type: Constructor, origin: string, basePath?: string): Nimble;
  public andRemote(type: Constructor, origin: string, basePath?: string): Nimble;

  public interceptCalls(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble;
  public interceptResults(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble;
  public interceptAllCalls(callback: InterceptorCallback): Nimble;
  public interceptAllResults(callback: InterceptorCallback): Nimble;

  public services(): any;
}
```

### new Nimble()

- Creates a new instance of Nimble.

### nimble.of(type)

- Registers a `local` service class to the nimble.

- `type` [`<Constructor>`](#constructor)

### nimble.ofLocal(type)

- Registers a `local` service class to the nimble.

- `type` [`<Constructor>`](#constructor)

### nimble.andLocal(type)

- Registers a `local` service class to the nimble.

- `type` [`<Constructor>`](#constructor)

### nimble.ofRemote(type, origin[, basePath])

- Registers a `remote` service class to the nimble.

- `type` [`<Constructor>`](#constructor)
- `origin` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- `basePath?` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### nimble.andRemote(type, origin[, basePath])

- Registers a `remote` service class to the nimble.

- `type` [`<Constructor>`](#constructor)
- `origin` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- `basePath?` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### nimble.interceptCalls(interceptors)

- Registers a set of custom [Client interceptors](#interceptorcallback) that execute `before` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### nimble.interceptResults(interceptors)

- Registers a set of custom [Client interceptors](#interceptorcallback) that execute `after` each request.

- `interceptors` [`<CustomInterceptors>`](#custominterceptors)

### nimble.interceptAllCalls(callback)

- Registers a custom [Client interceptor](#interceptorcallback) that executes `before` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### nimble.interceptAllResults(callback)

- Registers a custom [Client interceptor](#interceptorcallback) that executes `after` <i>all</i> requests.

- `callback` [`<InterceptorCallback>`](#interceptorcallback)

### nimble.services()

- Returns Nimble's service registry.

## Types

### Constructor

```ts
interface Constructor {
  new (...args: any[]);
}
```

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
type InterceptorCallback = ({setHeader, getHeader, setBody, getBody}: 
  {setHeader: (key: string, value: string) => any, getHeader: (key: string) => string, setBody: (body: any) => any, getBody: () => any}) => any;
```

### CustomInterceptors

```ts
type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback
  }
};
```