import { NextFunction, Request, Response } from 'express';
import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';

class TestService {
  async getAll() {
    return [1, 2, 3];
  }
  async addSomething(test) {
    return test;
  }
  async updateSomething(test) {
    return test;
  }
  async deleteSomething(test, test2) {
    return [test, test2];
  }
}

class TestServiceInterceptor {
  getAll(req: Request, res: Response, next: NextFunction) {}
  addSomething(req: Request, res: Response, next: NextFunction) {}
  updateSomething(req: Request, res: Response, next: NextFunction) {}
  deleteSomething(req: Request, res: Response, next: NextFunction) {}
}

class AdditionalService {
  private readonly testService: TestService;

  constructor({ testService }: { testService: TestService}) {
    this.testService = testService;
  }

  async getAll() {
    return this.testService.getAll();
  }
}

describe('NimblyApi', () => {

  it('should create nimble api', async () => {
    const nimble = new Nimble().of(TestService).of(AdditionalService);
    const app = new NimblyApi().from(nimble);

    expect(app).toHaveProperty('listen');
    expect(app).toHaveProperty('use');
  });

  it('should register interceptors for object', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      // .intercept({
      //   testService: {
      //     getAll(req: Request, res: Response, next: NextFunction) {

      //     }
      //   }
      // })
      .from(nimble);
  });

  it('should register interceptors for interceptor class', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      // .intercept({
      //   testService: TestServiceInterceptor
      // })
      .from(nimble);
  });

  it('should register a global interceptor function', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      // .interceptAll((req: Request, res: Response, next: NextFunction) => { })
      .from(nimble);
  });

  it('should register error mappings', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      // .withErrors({
      //   BusinessLogicError: 400,
      //   LostConnectionToTheDatabase: 500,
      // })
      .from(nimble);
  });

});