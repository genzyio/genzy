import { ServiceRegistry } from './service-registry';
import { RemoteProxyOf } from './remote-proxy';
import { LocalProxyOf } from './local-proxy';
import { CustomInterceptors, Interceptable } from '../../shared/types';

type InterceptorCallback = ({setHeader, getHeader, setBody, getBody}: 
  {setHeader: (key: string, value: string) => any, getHeader: (key: string) => string, setBody: (body: any) => any, getBody: () => any}) => any;

export class Nimble extends Interceptable<InterceptorCallback> {
  private registry: ServiceRegistry;

  constructor() {
    super();
    this.registry = new ServiceRegistry();
  }

  public ofLocal(type): Nimble { return this.of(type); }
  public andLocal(type): Nimble { return this.of(type); }
  public andRemote(type, origin: string, basePath: string = '/api'): Nimble { return this.ofRemote(type, origin, basePath); }

  public of(type): Nimble {
    LocalProxyOf(type, this.registry);
    return this;
  }

  public ofRemote(type, origin: string, basePath: string = '/api'): Nimble {
    RemoteProxyOf(type, origin, this.registry, this.interceptors, basePath);
    return this;
  }

  public services(): any {
    return this.registry.getAll();
  }

  public interceptAllCalls(callback: InterceptorCallback): Nimble {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllResults(callback: InterceptorCallback): Nimble {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public interceptCalls(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble {
    this.interceptCustom(customInterceptors, 'beforeCustomInterceptors');
    return this;
  }

  public interceptResults(customInterceptors: CustomInterceptors<InterceptorCallback>): Nimble {
    this.interceptCustom(customInterceptors, 'afterCustomInterceptors');
    return this;
  }

  
}