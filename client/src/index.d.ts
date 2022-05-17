type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback
  }
};

type InterceptorCallback = ({setHeader, getHeader, setBody, getBody}: 
  {setHeader: (key: string, value: string) => any, getHeader: (key: string) => string, setBody: (body: any) => any, getBody: () => any}) => any;

interface Constructor {
  new (...args: any[]);
}

export class Nimble {
  constructor();

  public interceptAllCalls(callback: InterceptorCallback): Nimble;
  public interceptAllResults(callback: InterceptorCallback): Nimble;
  public interceptCalls(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble;
  public interceptResults(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble;

  public ofLocal(type: Constructor): Nimble;
  public andLocal(type: Constructor): Nimble;
  public andRemote(type: Constructor, origin: string, basePath?: string): Nimble;

  public of(type: Constructor): Nimble;
  public ofRemote(type: Constructor, origin: string, basePath?: string): Nimble;

  public services(): any;
}

export function Service(rootPath: string): (target: any) => void;
export function Get(path?: string): (target: any, propertyKey: string) => void;
export function Post(path?: string): (target: any, propertyKey: string) => void;
export function Put(path?: string): (target: any, propertyKey: string) => void;
export function Delete(path?: string): (target: any, propertyKey: string) => void;
export function Patch(path?: string): (target: any, propertyKey: string) => void;
export function Query(name: string): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
