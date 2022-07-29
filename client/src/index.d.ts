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

  public addLocalService(type: Constructor): Nimble;
  public addLocalServices(...types: Constructor[]): Nimble;
  public addRemoteService(origin: string, type: Constructor): Nimble;
  public addRemoteServices(origin: string, ...types: Constructor[]): Nimble;

  public getAllServices(): any;
}

export function Controller(rootPath: string): (target: any) => void;
export function Get(path?: string): (target: any, propertyKey: string) => void;
export function Post(path?: string): (target: any, propertyKey: string) => void;
export function Put(path?: string): (target: any, propertyKey: string) => void;
export function Delete(path?: string): (target: any, propertyKey: string) => void;
export function Patch(path?: string): (target: any, propertyKey: string) => void;
export function Query(name: string): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Path(name: string): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Body(): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
