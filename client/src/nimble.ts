import { ServiceRegistry } from './service-registry';
import { RemoteProxyOf } from './remote-proxy';
import { LocalProxyOf } from './local-proxy';

export class Nimble {
  private registry: ServiceRegistry;

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
    RemoteProxyOf(type, origin, this.registry);
    return this;
  }

  public services(): any {
    return this.registry.getAll();
  }
}