import { Nimble } from '../src/nimble';

class TestService {
  public deps: { exampleService?: ExampleService } = {};
  
  constructor(deps = {}) {
    this.deps = deps;
  }

  async getExampleServiceResult() {
    return this.deps.exampleService.get();
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
}

class ExampleServiceInterceptor {
  get({setHeader, getHeader, setBody, getBody}) { }
}

describe('Nimble', () => {

  it('should ceate a Nimble', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      .services();
    
    expect(anotherService.deps).toHaveProperty('exampleService');
    expect(anotherService.deps).toHaveProperty('testService');

    expect(exampleService.deps).toHaveProperty('testService');
    expect(exampleService.deps).toHaveProperty('anotherService');

    expect(testService.deps).toHaveProperty('anotherService');
    expect(testService.deps).toHaveProperty('exampleService');

    expect(await (anotherService.deps as any).testService.getExampleServiceResult()).toEqual(await exampleService.get());
  });

  it('should register an interceptor for all calls', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptAllCalls(({setHeader, getHeader, setBody, getBody}) => { })
      .services();
  });

  it('should register an interceptor for example service get calls', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptCalls({
      //   exampleService: {
      //     get({setHeader, getHeader, setBody, getBody}) { }
      //   }
      // })
      .services();
  });

  it('should register an interceptor for example service interceptor class calls', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptCalls({
      //   exampleService: ExampleServiceInterceptor
      // })
      .services();
  });

  it('should register an interceptor for all results', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptAllResults(({setHeader, getHeader, setBody, getBody}) => { })
      .services();
  });

  it('should register an interceptor for example service get results', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptResults({
      //   exampleService: {
      //     get({setHeader, getHeader, setBody, getBody}) { }
      //   }
      // })
      .services();
  });

  it('should register an interceptor for example service interceptor class results', async () => {
    const {
      anotherService,
      exampleService,
      testService
    }: {
      anotherService: AnotherService;
      exampleService: ExampleService;
      testService: TestService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, 'http://localhost')
      .andLocal(TestService)
      // .interceptResults({
      //   exampleService: ExampleServiceInterceptor
      // })
      .services();
  });

});