import { ServiceRegistry } from './service-registry';
import { RemoteProxyOf } from './remote-proxy';
import { LocalProxyOf } from './local-proxy';
import { CustomInterceptors, Interceptable } from '../../shared/types';

interface Constructor {
  new (...args: any[]);
}

type InterceptorCallback = ({setHeader, getHeader, setBody, getBody}: 
  {setHeader: (key: string, value: string) => any, getHeader: (key: string) => string, setBody: (body: any) => any, getBody: () => any}) => any;

export class Nimble extends Interceptable<InterceptorCallback> {
  private registry: ServiceRegistry;

  constructor() {
    super();
    this.registry = new ServiceRegistry();
  }

  public addLocalService(type: Constructor): Nimble { return this.of(type); }
  public addLocalServices(...types: Constructor[]): Nimble { return this.of(...types); }
  public addRemoteService(origin: string, type: Constructor): Nimble { return this.ofRemote(origin, type); }
  public addRemoteServices(origin: string, ...types: Constructor[]): Nimble { return this.ofRemote(origin, ...types); }

  private of(...types: Constructor[]): Nimble {
    types.forEach(type => {
      LocalProxyOf(type, this.registry);
    });
    return this;
  }

  private ofRemote(origin: string, ...types: Constructor[]): Nimble {
    types.forEach(type => {
      RemoteProxyOf(type, origin, this.registry, this.interceptors);
    });
    return this;
  }

  public getAllServices(): any {
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