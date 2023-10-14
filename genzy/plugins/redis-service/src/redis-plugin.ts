import { N1mblyContainer, N1mblyPluginParams } from "@n1mbly/api";
import { N1mblyPlugin } from "@n1mbly/api";
import { RedisService } from "./redis-service";

export class Plugin extends N1mblyPlugin {
  private containers: N1mblyContainer[];
  constructor({ containers }: { containers: N1mblyContainer[] }) {
    super();
    this.containers = containers;
  }

  beforeAll(params: N1mblyPluginParams): void | Promise<void> {
    this.containers.forEach((container) => {
      container.addLocalService(RedisService);
    });
  }
}
