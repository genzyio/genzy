type CustomInterceptors<TInterceptorCallback> = {
  [classKey: string]: {
    [methodKey: string]: TInterceptorCallback;
  };
};

type InterceptorCallback = ({
  setHeader,
  getHeader,
  setBody,
  getBody,
}: {
  setHeader: (key: string, value: string) => any;
  getHeader: (key: string) => string;
  setBody: (body: any) => any;
  getBody: () => any;
}) => any;

interface Constructor {
  new (...args: any[]);
}

export class N1mblyContainer {
  constructor();

  public interceptAllCalls(callback: InterceptorCallback): N1mblyContainer;
  public interceptAllResults(callback: InterceptorCallback): N1mblyContainer;
  public interceptCalls(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyContainer;
  public interceptResults(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyContainer;

  public addAccessToContainer(
    containerName: string,
    container: N1mblyContainer
  ): N1mblyContainer;
  public addLocalService(type: Constructor): N1mblyContainer;
  public addLocalServices(...types: Constructor[]): N1mblyContainer;
  public addRemoteService(origin: string, type: Constructor): N1mblyContainer;
  public addRemoteServices(
    origin: string,
    ...types: Constructor[]
  ): N1mblyContainer;

  public getServices(): any;
  public getAllServices(): any;
}

export function Controller(
  rootPath: string,
  type?: Constructor
): (target: any) => void;
export function Get(path?: string): (target: any, propertyKey: string) => void;
export function Post(path?: string): (target: any, propertyKey: string) => void;
export function Put(path?: string): (target: any, propertyKey: string) => void;
export function Delete(
  path?: string
): (target: any, propertyKey: string) => void;
export function Patch(
  path?: string
): (target: any, propertyKey: string) => void;
export function Query(
  name: string
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Path(
  name: string
): (target: any, propertyKey?: string | symbol, parameterIndex?: any) => void;
export function Body(): (
  target: any,
  propertyKey?: string | symbol,
  parameterIndex?: any
) => void;
