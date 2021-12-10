import { NextFunction, Request, Response } from 'express';
import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'

const getAllResult = [1, 2, 3];
class TestService {
  async getAll() {
    return getAllResult;
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
  getAll(req: Request, res: Response, next: NextFunction) { res.sendStatus(201); }
  addSomething(req: Request, res: Response, next: NextFunction) { res.sendStatus(202); }
  updateSomething(req: Request, res: Response, next: NextFunction) { res.sendStatus(203); }
  deleteSomething(req: Request, res: Response, next: NextFunction) { res.sendStatus(204); }
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
    await agent(app)
      .get('/api/test-service/get-all')
      .expect(200);
    await agent(app)
      .get('/')
      .expect(404);
    await agent(app)
      .post('/api/test-service/add-something')
      .expect(200);
    await agent(app)
      .put('/api/test-service/update-something')
      .expect(200);
    await agent(app)
      .del('/api/test-service/delete-something')
      .expect(200);
  });

  it('should register before interceptors for object', async () => {
    const nimble = new Nimble().of(TestService);
    const interceptorResult = { result: [ { test: 'result' } ] };
    const interceptorAddResult = { result: [ { test: 'result' } ] };
    const app = new NimblyApi()
      .intercept({
        testService: {
          getAll(req: Request, res: Response, next: NextFunction) {
            res.status(202);
            res.json(interceptorResult);
          }
        },
        TestService: {
          addSomething(req: Request, res: Response, next: NextFunction) {
            res.status(201);
            res.json(interceptorAddResult);
          }
        }
      })
      .from(nimble);

    await agent(app)
      .get('/api/test-service/get-all')
      .expect(202, interceptorResult);
    await agent(app)
      .get('/')
      .expect(404);
    await agent(app)
      .post('/api/test-service/add-something')
      .expect(201, interceptorAddResult);
    await agent(app)
      .put('/api/test-service/update-something')
      .expect(200);
  });

  it('should register after interceptors for object', async () => {
    const nimble = new Nimble().of(TestService);

    const app = new NimblyApi()
      .interceptAfter({
        testService: {
          getAll(req: Request, res: Response, next: NextFunction) {
            res.status(202);
            next();
          },
          addSomething(req: Request, res: Response, next: NextFunction) {
            res.status(201);
            next();
          }
        },
      })
      .from(nimble);

    await agent(app)
      .get('/api/test-service/get-all')
      .expect(202, getAllResult);
    await agent(app)
      .get('/')
      .expect(404);
    await agent(app)
      .post('/api/test-service/add-something')
      .expect(201);
    await agent(app)
      .put('/api/test-service/update-something')
      .expect(200);
  });

  it('should register interceptors for interceptor class', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      .intercept({
        testService: TestServiceInterceptor as any
      })
      .from(nimble);
    
    await agent(app)
      .get('/')
      .expect(404);
    await agent(app)
      .get('/api/test-service/get-all')
      .expect(201);
    await agent(app)
      .post('/api/test-service/add-something')
      .expect(202);
    await agent(app)
      .put('/api/test-service/update-something')
      .expect(203);
    await agent(app)
      .del('/api/test-service/delete-something')
      .expect(204);
  });

  it('should register a global interceptor before function', async () => {
    const nimble = new Nimble().of(TestService);
    const interceptorResult = { test: 'result' };
    const app = new NimblyApi()
      .interceptAll((req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        res.json(interceptorResult);
      })
      .from(nimble);
    
    await agent(app)
      .get('/api/test-service/get-all')
      .expect(201, interceptorResult);
    await agent(app)
      .get('/')
      .expect(404);
  });

  it('should register a global interceptor after function', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      })
      .from(nimble);
    
    await agent(app)
      .get('/api/test-service/get-all')
      .expect(201, getAllResult);
    await agent(app)
      .get('/')
      .expect(404);
  });

  it('should call after interceptor function last', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      .interceptAllAfter((req: Request, res: Response, next: NextFunction) => {
        res.status(201);
        next();
      })
      .interceptAll((req: Request, res: Response, next: NextFunction) => {
        res.status(202);
        next();
      })
      .from(nimble);
    
    await agent(app)
      .get('/api/test-service/get-all')
      .expect(201, getAllResult);
    await agent(app)
      .get('/')
      .expect(404);
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