import { ServiceRegistry } from './service-registry';
import { CustomInterceptorKey, CustomInterceptors, getMethodsOfClassInstance, InterceptorCallback, Interceptors, RemoteProxyOf } from './remote-proxy';
import { LocalProxyOf } from './local-proxy';

export function upperFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class Nimble {
  private registry: ServiceRegistry;
  private interceptors: Interceptors = {
    callInterceptors: [],
    resultInterceptors: [],
    callCustomInterceptors: {},
    resultCustomInterceptors: {}
  }

  constructor() {
    this.registry = new ServiceRegistry();
  }

  public ofLocal(type): Nimble { return this.of(type); }
  public andLocal(type): Nimble { return this.of(type); }
  public andRemote(type, origin: string): Nimble { return this.ofRemote(type, origin); }

  public of(type): Nimble {
    LocalProxyOf(type, this.registry);
    return this;
  }

  public ofRemote(type, origin: string): Nimble {
    RemoteProxyOf(type, origin, this.registry, this.interceptors);
    return this;
  }

  public services(): any {
    return this.registry.getAll();
  }

  public interceptAllCalls(callback: InterceptorCallback): Nimble {
    this.interceptors.callInterceptors.push(callback);
    return this;
  }

  public interceptAllResults(callback: InterceptorCallback): Nimble {
    this.interceptors.resultInterceptors.push(callback);
    return this;
  }

  public interceptCalls(customInterceptors: CustomInterceptors): Nimble {
    return this.interceptCustom(customInterceptors, 'callCustomInterceptors');
  }

  public interceptResults(customInterceptors: CustomInterceptors): Nimble {
    return this.interceptCustom(customInterceptors, 'resultCustomInterceptors');
  }

  private interceptCustom(customInterceptors: CustomInterceptors, customInterceptorsKey: CustomInterceptorKey): Nimble {
    Object.keys(customInterceptors).forEach((classK) => {
      const classKey = upperFirstLetter(classK);
      if (!this.interceptors[customInterceptorsKey][classKey]) {
        this.interceptors[customInterceptorsKey][classKey] = {};
      }
      const referenceObject =
        typeof customInterceptors[classK] !== "function"
          ? customInterceptors[classK]
          : new (customInterceptors[classK] as any)();
      const methodKeys: string[] =
        typeof customInterceptors[classK] !== "function"
          ? Object.keys(referenceObject)
          : (getMethodsOfClassInstance(referenceObject) as any);
      methodKeys.forEach((methodKey) => {
        if (!this.interceptors[customInterceptorsKey][classKey][methodKey]) {
          this.interceptors[customInterceptorsKey][classKey][methodKey] = [];
        }
        this.interceptors[customInterceptorsKey][classKey][methodKey].push(
          referenceObject[methodKey]
        );
      });
    });
    return this;
  }
}