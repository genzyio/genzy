import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'
import { NextFunction, Request, Response } from 'express';
import { Delete, Get, Controller, Patch, Post, Put } from '../../shared/decorators';
import { NimblyConfig } from '../../shared/types';

const getAllResult = [1, 2, 3];

class TestService {
  $nimbly: NimblyConfig = {
    path: '/tests',
    getAll: {
      httpMethod: 'GET',
      path: '/'
    },
    getById: {
      path: '/:id',
      params: [
        { name: 'id', source: 'path' },
        { name: 'body', source: 'body'}
      ]
    },
    differentAddSomething: {
      httpMethod: 'POST',
      path: '/'
    },
    randomUpdate: {
      httpMethod: 'PUT',
      path: '/random/:entityId',
      params: [
        { name: 'entityId', source: 'path' },
        { name: 'body', source: 'body'}
      ]
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

@Controller('/annotated')
class AnnotatedService {
 
  async get() {}
 
  @Get('/testing')
  async getTest() {}

  @Post('/testing')
  async postTest(body: any) {
    return body;
  }

  @Put('/testing/:id')
  async putTest(id: string, body: any) {
    return {...body, id};
  }

  @Delete('/testing/:id')
  async delTest(id: string) {
    return {id};
  }

  @Patch('/testing/:id')
  async patchTest(id: string, body: any) {
    return [{...body, id}];
  }
}

class TestServiceInterceptor {
  getAll(req: Request, res: Response, next: NextFunction) { res.status(201); next(); }
  differentAddSomething(req: Request, res: Response, next: NextFunction) { res.sendStatus(202); }
}

describe('NimblyApi Custom Paths', () => {

  it('should register a custom root path', async () => {
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
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

  it('should register a custom root path with annotation', async () => {
    const nimble = new Nimble().addLocalService(AnnotatedService);
    const app = new NimblyApi().from(nimble);
    await agent(app)
      .get('/api/annotated-service/get')
      .expect(404);
    await agent(app)
      .get('/api/annotated/get')
      .expect(200);
  });

  it('should register a custom method path with annotation', async () => {
    const nimble = new Nimble().addLocalService(AnnotatedService);
    const app = new NimblyApi().from(nimble);
    await agent(app)
      .get('/api/annotated/testing')
      .expect(200);
  });

  it('should work for all annotations', async () => {
    const nimble = new Nimble().addLocalService(AnnotatedService);
    const app = new NimblyApi().from(nimble);
    const id = '1234';
    const body = { test: '123', a: 1 };
    await agent(app)
      .get('/api/annotated/testing')
      .expect(200);
    await agent(app)
      .post('/api/annotated/testing')
      .send(body)
      .expect(200, body);
    await agent(app)
      .put(`/api/annotated/testing/${id}`)
      .send(body)
      .expect(200, {...body, id});
    await agent(app)
      .delete(`/api/annotated/testing/${id}`)
      .expect(200, {id});
    await agent(app)
      .patch(`/api/annotated/testing/${id}`)
      .send(body)
      .expect(200, [{...body, id}]);
  });

});