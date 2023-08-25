import { ServiceRegistry } from "../src/service-registry";
import { LocalProxyOf } from "../src/local-proxy";
import { RemoteProxyOf } from "../src/remote-proxy";
import { lowerFirstLetter } from "../../shared/functions";

class TestService {
  public deps: { exampleService?: any } = {};

  constructor(deps = {}) {
    this.deps = deps;
  }

  async getExampleServiceResult() {
    return this.deps.exampleService.get();
  }
}

class ExampleService {
  async get() {
    return [1, 2, 3];
  }
}

class AnotherService {
  public deps = {};

  constructor(deps = {}) {
    this.deps = deps;
  }
}

const serviceRegistry = new ServiceRegistry();

describe("ServiceRegistry", () => {
  it("should register a test service", async () => {
    const instance = LocalProxyOf<TestService>(TestService, serviceRegistry);
    serviceRegistry.register(lowerFirstLetter(TestService.name), instance);

    const result = serviceRegistry.getAll();

    expect(result).toHaveProperty("testService");
  });

  it("should update dependencies", async () => {
    const testInstance = LocalProxyOf<TestService>(
      TestService,
      serviceRegistry
    );
    const exampleInstance = LocalProxyOf<ExampleService>(
      ExampleService,
      serviceRegistry
    );
    const anotherInstance = RemoteProxyOf<AnotherService>(
      AnotherService,
      "http://localhost",
      serviceRegistry
    );

    serviceRegistry.register(lowerFirstLetter(TestService.name), testInstance);
    serviceRegistry.register(
      lowerFirstLetter(ExampleService.name),
      exampleInstance
    );
    serviceRegistry.register(
      lowerFirstLetter(AnotherService.name),
      anotherInstance
    );

    const result = serviceRegistry.getAll() as any;

    expect(result).toHaveProperty("testService");
    expect(result).toHaveProperty("anotherService");

    expect(result.anotherService.deps).toHaveProperty("testService");
    expect(result.anotherService.deps).toHaveProperty("exampleService");

    expect(result.testService.deps).toHaveProperty("anotherService");
    expect(result.testService.deps).toHaveProperty("exampleService");

    expect(await result.testService.getExampleServiceResult()).toEqual([
      1, 2, 3,
    ]);
  });
});
