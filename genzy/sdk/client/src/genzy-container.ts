import { ServiceRegistry, getRefProxy } from "./service-registry";
import { RemoteProxyOf } from "./remote-proxy";
import { LocalProxyOf } from "./local-proxy";
import { CustomInterceptors, Interceptable } from "../../shared/types";
import { lowerFirstLetter } from "../../shared/functions";

interface Constructor {
  new (...args: any[]);
}

type InterceptorCallback = ({
  setHeader,
  getHeader,
  setBody,
  getBody,
}: {
  setHeader: (key: string, value: string) => void;
  getHeader: (key: string) => string;
  setBody: (body: any) => void;
  getBody: () => any;
}) => Promise<void> | void;

export class GenzyContainer extends Interceptable<InterceptorCallback> {
  private allServicesRegistry: ServiceRegistry;
  private internalServiceKeys: string[] = [];

  constructor() {
    super();
    this.allServicesRegistry = new ServiceRegistry();
  }

  public addLocalService(type: Constructor): GenzyContainer {
    this.add(type);
    return this;
  }

  public addLocalServices(...types: Constructor[]): GenzyContainer {
    this.add(...types);
    return this;
  }

  public addRemoteService(origin: string, type: Constructor): GenzyContainer {
    this.addRemote(origin, type);
    return this;
  }

  public addRemoteServices(
    origin: string,
    ...types: Constructor[]
  ): GenzyContainer {
    this.addRemote(origin, ...types);
    return this;
  }

  private add(...types: Constructor[]): GenzyContainer {
    types.forEach((type) => {
      const instance = LocalProxyOf(type, this.allServicesRegistry);
      const serviceKey = lowerFirstLetter(type.name || type.constructor.name);
      this.internalServiceKeys.push(serviceKey);
      this.allServicesRegistry.register(serviceKey, instance);
    });
    return this;
  }

  private addRemote(origin: string, ...types: Constructor[]): GenzyContainer {
    types.forEach((type) => {
      const instance = RemoteProxyOf(
        type,
        origin,
        this.allServicesRegistry,
        this.interceptors
      );
      const serviceKey = lowerFirstLetter(type.name || type.constructor.name);
      this.internalServiceKeys.push(serviceKey);
      this.allServicesRegistry.register(serviceKey, instance);
    });
    return this;
  }

  public addAccessToContainer(
    containerName: string,
    container: GenzyContainer
  ): GenzyContainer {
    this.allServicesRegistry.getAll()[containerName];

    Object.keys(container.getServices())
      .filter((x) => !x.startsWith("$"))
      .forEach((key) => {
        this.allServicesRegistry.getAll()[containerName][key] =
          container.getServices()[key];
      });
    return this;
  }

  public getServices(): any {
    const result = getRefProxy();
    this.internalServiceKeys.forEach((key) => {
      result[key] = this.allServicesRegistry.getAll()[key];
    });
    return result;
  }

  public getAllServices(): any {
    return this.allServicesRegistry.getAll();
  }

  public interceptAllCalls(callback: InterceptorCallback): GenzyContainer {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllResults(callback: InterceptorCallback): GenzyContainer {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public interceptCalls(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer {
    this.interceptCustom(customInterceptors, "beforeCustomInterceptors");
    return this;
  }

  public interceptResults(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): GenzyContainer {
    this.interceptCustom(customInterceptors, "afterCustomInterceptors");
    return this;
  }
}
