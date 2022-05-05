import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'
import { NextFunction, Request, Response } from 'express';

const getAllResult = [1, 2, 3];

class TestService {
  $nimbly = {
    rootPath: 'tests',
    getAll: {
      method: 'GET',
      path: ''
    },
    getById: {
      path: ':id'
    },
    differentAddSomething: {
      method: 'POST',
      path: ''
    },
    randomUpdate: {
      method: 'PUT',
      path: 'random/:entityId'
    }
  }

  async getAll() {
    return getAllResult;
  }
  async getById(id: number) {
    return {id};
  }
  async differentAddSomething(test) {
    return test;
  }
  async randomUpdate(id: number, test: any) {
    return {
      id,
      ...test
    };
  }
}

class TestServiceInterceptor {
  getAll(req: Request, res: Response, next: NextFunction) { res.status(201); next(); }
  differentAddSomething(req: Request, res: Response, next: NextFunction) { res.sendStatus(202); }
}

describe('NimblyApi Custom Paths', () => {

  it('should register a custom root path', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi().from(nimble);

    await agent(app)
      .get('/api/test-service/get-all')
      .expect(404);
    await agent(app)
      .get('/api/tests')
      .expect(200, getAllResult);
    await agent(app)
      .post('/api/tests')
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
      .get('/api/tests')
      .expect(201, getAllResult);
    await agent(app)
      .post('/api/tests')
      .expect(202);
  });

  it('should register route with path param', async () => {
    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi()
      .intercept({
        testService: TestServiceInterceptor as any
      })
      .from(nimble);
    
    await agent(app)
      .get('/api/tests/123')
      .expect(200, { id: '123' });
    const obj = { test: 'asdf' };
    await agent(app)
      .put('/api/tests/random/123')
      .send(obj)
      .expect(200, { id: '123', ...obj });
  });
});