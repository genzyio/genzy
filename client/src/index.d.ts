interface Constructor {
  new (...args: any[]);
}

export class Nimble {
  constructor();

  public ofLocal(type: Constructor): Nimble;
  public andLocal(type: Constructor): Nimble;
  public andRemote(type: Constructor, origin: string): Nimble;

  public of(type: Constructor): Nimble;
  public ofRemote(type: Constructor, origin: string): Nimble;

  public services(): any;
}

export class ServiceRegistry {
  public register(key: string, service: any): void;
  public register(service: any): void;
  public getAll(): any;
}

export function LocalProxyOf<T>(type: Constructor, serviceRegistry: ServiceRegistry): T;
export function RemoteProxyOf<T>(type: Constructor, origin: string, serviceRegistry: ServiceRegistry): T;