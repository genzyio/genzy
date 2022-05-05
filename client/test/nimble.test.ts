import { Nimble } from '../src/nimble';
import realAxios from 'axios';

jest.mock('axios');
const axios = realAxios as jest.Mocked<typeof realAxios>;

const origin = 'http://localhost/';
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

  async getTest(): Promise<number> { return 0; }
}
class AnotherServiceCallInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setHeader('classInterceptor', 'Works!')
  }
}

class AnotherServiceResultInterceptor {
  getTest({setHeader, getHeader, setBody, getBody}) {
    setBody(getBody() ? "not null" : "is null");
  }
}

describe('Nimble', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

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
      .andRemote(AnotherService, origin)
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
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptAllCalls(({setHeader, getHeader, setBody, getBody}) => {
        setHeader('testHeader', 'testValue');
      })
      .services();
    (axios as any).mockResolvedValue({ data: 123 });
    
    await anotherService.getTest();
    
    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {
        testHeader: 'testValue'
      },
      url: origin + 'api/another-service/get-test'
    });
  });

  it('should register an interceptor for another service get calls', async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptCalls({
        anotherService: {
          getTest({setHeader, getHeader, setBody, getBody}) {
            setHeader('anotherHeader', 'anotherValue');
            setBody({ args: [1] });
          }
        }
      })
      .services();
    (axios as any).mockResolvedValue({ data: 123 });
  
    await anotherService.getTest();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: {args: [1]},
      headers: {
        anotherHeader: 'anotherValue'
      },
      url: origin + 'api/another-service/get-test'
    });
  });

  it('should register an interceptor for another service interceptor class calls', async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptCalls({
        anotherService: AnotherServiceCallInterceptor
      })
      .services();
    (axios as any).mockResolvedValue({ data: 123 });

    await anotherService.getTest();
    
    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {
        classInterceptor: 'Works!'
      },
      url: origin + 'api/another-service/get-test'
    });
  });

  it('should register an interceptor for all results', async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptAllResults(({setHeader, getHeader, setBody, getBody}) => {
        setBody(getBody() + 10);
      })
      .services();
    const initialResult = 123;
    (axios as any).mockResolvedValue({ data: initialResult });

    const result = await anotherService.getTest();

    expect(result).toEqual(initialResult + 10)
  });

  it('should register an interceptor for another service get results', async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptResults({
        anotherService: {
          getTest({setHeader, getHeader, setBody, getBody}) {
            setBody({ ...getBody(), test: 'works' });
          }
        }
      })
      .services();
    const initialResult = { does: 'it work?' };
    (axios as any).mockResolvedValue({ data: initialResult });

    const result = await anotherService.getTest();

    expect(result).toEqual({ ...initialResult, test: 'works' });
  });

  it('should register an interceptor for another service interceptor class results', async () => {
    const {
      anotherService,
    }: {
      anotherService: AnotherService;
    } = new Nimble().ofLocal(ExampleService)
      .andRemote(AnotherService, origin)
      .andLocal(TestService)
      .interceptResults({
        anotherService: AnotherServiceResultInterceptor
      })
      .services();
    (axios as any).mockResolvedValue({ data: null });
    
    const resultNull = await anotherService.getTest();
    
    expect(resultNull).toEqual("is null");

    (axios as any).mockResolvedValue({ data: {} });
    
    const result = await anotherService.getTest();
    
    expect(result).toEqual("not null");
  });
});