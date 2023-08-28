import { ServiceRegistry } from "./service-registry";
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
  setHeader: (key: string, value: string) => any;
  getHeader: (key: string) => string;
  setBody: (body: any) => any;
  getBody: () => any;
}) => any;

export class N1mblyContainer extends Interceptable<InterceptorCallback> {
  private internalOnlyRegistry: ServiceRegistry;
  private allServicesRegistry: ServiceRegistry;

  private serviceRegisters: (() => void)[] = [];
  private containerAccessRegisters: (() => void)[] = [];

  constructor() {
    super();
    this.internalOnlyRegistry = new ServiceRegistry();
    this.allServicesRegistry = new ServiceRegistry();
  }

  public addLocalService(type: Constructor): N1mblyContainer {
    this.serviceRegisters.push(() => {
      this.add(type);
    });
    this.build();
    return this;
  }
  public addLocalServices(...types: Constructor[]): N1mblyContainer {
    this.serviceRegisters.push(() => {
      this.add(...types);
    });
    this.build();
    return this;
  }
  public addRemoteService(origin: string, type: Constructor): N1mblyContainer {
    this.serviceRegisters.push(() => {
      this.addRemote(origin, type);
    });
    this.build();
    return this;
  }
  public addRemoteServices(
    origin: string,
    ...types: Constructor[]
  ): N1mblyContainer {
    this.serviceRegisters.push(() => {
      this.addRemote(origin, ...types);
    });
    this.build();
    return this;
  }

  private add(...types: Constructor[]): N1mblyContainer {
    types.forEach((type) => {
      const instance = LocalProxyOf(type, this.allServicesRegistry);
      this.internalOnlyRegistry.register(
        lowerFirstLetter(type.name || type.constructor.name),
        instance
      );
      this.allServicesRegistry.register(
        lowerFirstLetter(type.name || type.constructor.name),
        instance
      );
    });
    return this;
  }

  private addRemote(origin: string, ...types: Constructor[]): N1mblyContainer {
    types.forEach((type) => {
      const instance = RemoteProxyOf(
        type,
        origin,
        this.allServicesRegistry,
        this.interceptors
      );
      this.internalOnlyRegistry.register(
        lowerFirstLetter(type.name || type.constructor.name),
        instance
      );
      this.allServicesRegistry.register(
        lowerFirstLetter(type.name || type.constructor.name),
        instance
      );
    });
    return this;
  }

  public addAccessToContainer(
    containerName: string,
    container: N1mblyContainer
  ): N1mblyContainer {
    this.containerAccessRegisters.push(() => {
      this.allServicesRegistry.getAll()[containerName] = {
        ...container.getServices(),
      };
    });
    this.build();
    return this;
  }

  public getServices(): any {
    return this.internalOnlyRegistry.getAll();
  }

  public getAllServices(): any {
    return this.allServicesRegistry.getAll();
  }

  public interceptAllCalls(callback: InterceptorCallback): N1mblyContainer {
    this.interceptors.beforeInterceptors.push(callback);
    return this;
  }

  public interceptAllResults(callback: InterceptorCallback): N1mblyContainer {
    this.interceptors.afterInterceptors.push(callback);
    return this;
  }

  public interceptCalls(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyContainer {
    this.interceptCustom(customInterceptors, "beforeCustomInterceptors");
    return this;
  }

  public interceptResults(
    customInterceptors: CustomInterceptors<InterceptorCallback>
  ): N1mblyContainer {
    this.interceptCustom(customInterceptors, "afterCustomInterceptors");
    return this;
  }

  private build() {
    this.internalOnlyRegistry = new ServiceRegistry();
    this.allServicesRegistry = new ServiceRegistry();

    this.containerAccessRegisters.forEach((cb) => cb());
    try {
      this.serviceRegisters.forEach((cb) => cb());
    } catch (error) {}
  }
}
