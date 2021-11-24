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

});