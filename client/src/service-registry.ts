export class ServiceRegistry {
  private registry: object = {};

  public register(key: string, instance?: any) {
    this.registry[key] = instance;
  }

  public getAll() {
    return this.registry;
  }
}
