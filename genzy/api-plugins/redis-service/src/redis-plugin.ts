import { GenzyContainer, GenzyPluginParams } from "@genzy.io/api";
import { GenzyPlugin } from "@genzy.io/api";
import { RedisService } from "./redis-service";

export class Plugin extends GenzyPlugin {
  private containers: GenzyContainer[];
  constructor({ containers }: { containers: GenzyContainer[] }) {
    super();
    this.containers = containers;
  }

  beforeAll(params: GenzyPluginParams): void | Promise<void> {
    this.containers.forEach((container) => {
      container.addLocalService(RedisService);
    });
  }
}
