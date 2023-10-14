import { N1mblyContainer } from "../src/n1mbly-container";
import realAxios from "axios";

jest.mock("axios");
const axios = realAxios as jest.Mocked<typeof realAxios>;

const origin = "http://localhost";
class TestService {
  public deps: { exampleService?: ExampleService } = {};

  constructor(deps = {}) {
    this.deps = deps;
  }

  async getExampleServiceResult() {
    return this.deps.exampleService?.get();
  }
}

class ExampleService {
  public deps = {};

  constructor(deps = {}) {
    this.deps = deps;
  }

  async get() {
    return [1, 2, 3];
  }
}

class AnotherService {
  public deps = {};

  constructor(deps = {}) {
    this.deps = deps;
  }

  async getTest(): Promise<number> {
    return 0;
  }
}
class AnotherServiceCallInterceptor {
  getTest({ setHeader, getHeader, setBody, getBody }) {
    setHeader("classInterceptor", "Works!");
  }
}

class AnotherServiceResultInterceptor {
  getTest({ setHeader, getHeader, setBody, getBody }) {
    setBody(getBody() ? "not null" : "is null");
  }
}

describe("N1mblyContainer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should ceate a N1mblyContainer", async () => {
    const {
      anotherService,
      exampleService,
      testService,
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new N1mblyContainer()
      .addLocalServices(ExampleService, TestService)
      .addRemoteService(origin, AnotherService)
      .getAllServices();

    expect(anotherService.deps).toHaveProperty("exampleService");
    expect(anotherService.deps).toHaveProperty("testService");

    expect(exampleService.deps).toHaveProperty("testService");
    expect(exampleService.deps).toHaveProperty("anotherService");

    expect(testService.deps).toHaveProperty("anotherService");
    expect(testService.deps).toHaveProperty("exampleService");

    expect(
      await (anotherService.deps as any).testService.getExampleServiceResult()
    ).toEqual(await exampleService.get());
  });

  it("should have access to services from another container N1mblyContainer and handle circular deps", async () => {
    const anotherContainer = new N1mblyContainer().addRemoteService(
      origin,
      AnotherService
    );
    const container = new N1mblyContainer()
      .addAccessToContainer("another", anotherContainer)
      .addLocalServices(ExampleService, TestService);

    anotherContainer.addAccessToContainer("container", container);

    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = anotherContainer.getAllServices();

    const {
      exampleService,
      testService,
    }: {
      exampleService: ExampleService;
      testService: TestService;
      another: {
        anotherService: AnotherService;
      };
    } = container.getAllServices();

    expect(anotherService.deps).toHaveProperty("container.exampleService");
    expect(anotherService.deps).toHaveProperty("container.testService");

    expect(exampleService.deps).toHaveProperty("testService");
    expect(exampleService.deps).toHaveProperty("another.anotherService");

    expect(testService.deps).toHaveProperty("exampleService");
    expect(testService.deps).toHaveProperty("another.anotherService");

    expect(
      await (
        anotherService.deps as any
      ).container.testService.getExampleServiceResult()
    ).toEqual(await exampleService.get());
  });

  it("should register an interceptor for all calls", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptAllCalls(({ setHeader, getHeader, setBody, getBody }) => {
        setHeader("testHeader", "testValue");
      })
      .getAllServices();
    (axios as any).mockResolvedValue({ data: 123 });

    await anotherService.getTest();

    expect(axios).toBeCalledWith({
      method: "get",
      data: null,
      headers: {
        testHeader: "testValue",
      },
      url: origin + "/another-service/get-test",
    });
  });

  it("should register an interceptor for another service get calls", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptCalls({
        anotherService: {
          getTest({ setHeader, getHeader, setBody, getBody }) {
            setHeader("anotherHeader", "anotherValue");
            setBody({ args: [1] });
          },
        },
      })
      .getAllServices();
    (axios as any).mockResolvedValue({ data: 123 });

    await anotherService.getTest();

    expect(axios).toBeCalledWith({
      method: "get",
      data: { args: [1] },
      headers: {
        anotherHeader: "anotherValue",
      },
      url: origin + "/another-service/get-test",
    });
  });

  it("should register an interceptor for another service interceptor class calls", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptCalls({
        anotherService: AnotherServiceCallInterceptor,
      })
      .getAllServices();
    (axios as any).mockResolvedValue({ data: 123 });

    await anotherService.getTest();

    expect(axios).toBeCalledWith({
      method: "get",
      data: null,
      headers: {
        classInterceptor: "Works!",
      },
      url: origin + "/another-service/get-test",
    });
  });

  it("should register an interceptor for all results", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptAllResults(({ setHeader, getHeader, setBody, getBody }) => {
        setBody(getBody() + 10);
      })
      .getAllServices();
    const initialResult = 123;
    (axios as any).mockResolvedValue({ data: initialResult });

    const result = await anotherService.getTest();

    expect(result).toEqual(initialResult + 10);
  });

  it("should register an interceptor for another service get results", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptResults({
        anotherService: {
          getTest({ setHeader, getHeader, setBody, getBody }) {
            setBody({ ...getBody(), test: "works" });
          },
        },
      })
      .getAllServices();
    const initialResult = { does: "it work?" };
    (axios as any).mockResolvedValue({ data: initialResult });

    const result = await anotherService.getTest();

    expect(result).toEqual({ ...initialResult, test: "works" });
  });

  it("should register an interceptor for another service interceptor class results", async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new N1mblyContainer()
      .addLocalService(ExampleService)
      .addRemoteService(origin, AnotherService)
      .addLocalService(TestService)
      .interceptResults({
        anotherService: AnotherServiceResultInterceptor,
      })
      .getAllServices();
    (axios as any).mockResolvedValue({ data: null });

    const resultNull = await anotherService.getTest();

    expect(resultNull).toEqual("is null");

    (axios as any).mockResolvedValue({ data: {} });

    const result = await anotherService.getTest();

    expect(result).toEqual("not null");
  });

  it("should resolve a complex graph of deps", async () => {
    class Service1 {
      public service3: Service3;
      public service2: Service2;

      constructor(deps: { service2: Service2; service3: Service3 }) {
        this.service2 = deps.service2;
        this.service3 = deps.service3;
      }

      public getS1() {
        return [1, 2, 3];
      }
    }

    class Service2 {
      public service3: Service3;

      constructor(deps: { service3: Service3 }) {
        this.service3 = deps.service3;
      }

      public getS2() {
        return [1, 2, 3];
      }
    }

    class Service3 {
      public service1: Service1;

      constructor(deps: { service1: Service1 }) {
        this.service1 = deps.service1;
      }

      public getS3() {
        return [1, 2, 3];
      }
    }

    const services = new N1mblyContainer()
      .addLocalServices(Service1, Service2, Service3)
      .getAllServices();

    expect(services).toHaveProperty("service1");
    expect(services).toHaveProperty("service2");
    expect(services).toHaveProperty("service3");

    expect(services.service1.service2).toBe(services.service2);
    expect(services.service1.service3).toBe(services.service3);
    expect(services.service2.service3).toBe(services.service3);
    expect(services.service3.service1).toBe(services.service1);

    expect(typeof services.service1.getS1).toBe("function");
    expect(typeof services.service2.getS2).toBe("function");
    expect(typeof services.service3.getS3).toBe("function");

    expect(typeof services.service3.service1.getS1).toBe("function");
    expect(typeof services.service1.service2.getS2).toBe("function");
    expect(typeof services.service2.service3.getS3).toBe("function");
  });

  it("should resolve a complex graph of deps using containers", async () => {
    class Service1 {
      public service3: Service3;
      public service2: Service2;

      constructor(deps: {
        services: { service2: Service2; service3: Service3 };
      }) {
        this.service2 = deps.services.service2;
        this.service3 = deps.services.service3;
      }

      public getS1() {
        return [1, 2, 3];
      }
    }

    class Service2 {
      public service3: Service3;

      constructor(deps: { service3: Service3 }) {
        this.service3 = deps.service3;
      }

      public getS2() {
        return [1, 2, 3];
      }
    }

    class Service3 {
      public service2: Service2;

      constructor(deps: { service2: Service2 }) {
        this.service2 = deps.service2;
      }

      public getS3() {
        return [1, 2, 3];
      }
    }

    const cont = new N1mblyContainer().addLocalServices(Service1);

    const cont23 = new N1mblyContainer().addLocalServices(Service2, Service3);

    cont.addAccessToContainer("services", cont23);

    const contAllServices = cont.getAllServices();

    expect(contAllServices).toHaveProperty("service1");
    expect(contAllServices.services).toHaveProperty("service2");
    expect(contAllServices.services).toHaveProperty("service3");

    expect(typeof contAllServices.service1.getS1).toBe("function");
    expect(typeof contAllServices.service1.service2.getS2).toBe("function");
    expect(typeof contAllServices.service1.service3.getS3).toBe("function");

    expect(typeof contAllServices.services.service2.getS2).toBe("function");
    expect(typeof contAllServices.services.service3.getS3).toBe("function");

    expect(typeof contAllServices.service1.service2.getS2).toBe("function");
    expect(typeof contAllServices.services.service3.service2.getS2).toBe(
      "function"
    );
    expect(typeof contAllServices.services.service2.service3.getS3).toBe(
      "function"
    );
  });

  it("should resolve a circular dep", async () => {
    class Service2 {
      public service3: Service3;

      constructor(deps: { service3: Service3 }) {
        this.service3 = deps.service3;
      }

      public getS2() {
        return [1, 2, 3];
      }
    }

    class Service3 {
      public service2: Service2;

      constructor(deps: { service2: Service2 }) {
        this.service2 = deps.service2;
      }

      public getS3() {
        return [1, 2, 3];
      }
    }

    const cont = new N1mblyContainer().addLocalServices(Service2, Service3);

    const contAllServices = cont.getAllServices();

    expect(contAllServices).toHaveProperty("service2");
    expect(contAllServices).toHaveProperty("service3");

    expect(typeof contAllServices.service3.service2.getS2).toBe("function");
    expect(typeof contAllServices.service2.service3.getS3).toBe("function");
  });
});
