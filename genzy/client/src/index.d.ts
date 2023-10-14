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

export class GenzyContainer {
  constructor();

  public interceptAllCalls(callback: InterceptorCallback): GenzyContainer;
  public interceptAllResults(callback: InterceptorCallback): GenzyContainer;
  public interceptCalls(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer;
  public interceptResults(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer;

  public addAccessToContainer(
    containerName: string,
    container: GenzyContainer
  ): GenzyContainer;
  public addLocalService(type: Constructor): GenzyContainer;
  public addLocalServices(...types: Constructor[]): GenzyContainer;
  public addRemoteService(origin: string, type: Constructor): GenzyContainer;
  public addRemoteServices(
    origin: string,
    ...types: Constructor[]
  ): GenzyContainer;

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
