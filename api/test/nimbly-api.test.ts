import * as express from 'express';
import * as cors from "cors";
import { NextFunction, Request, Response } from 'express';
import { Nimble } from '@n1mbly/client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'

const getAllResult = [1, 2, 3];
const BAD_LOGIC_ERROR_MESSAGE = "Bad logic error thrown.";
const INTERNAL_SERVER_ERROR_MESSAGE = "Lost connection to the database.";

class BadLogicError extends Error {
  name = "BadLogicError";
  constructor(message?: string) {
    super(message);
  }
}

class InternalServerError extends Error {
  name = "InternalServerError";
  constructor(message?: string) {
    super(message);
  }
}

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
  async getBadLogicError() {
    throw new BadLogicError(BAD_LOGIC_ERROR_MESSAGE);
  }
  async getInternalServerError() {
    throw new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE);
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
    const nimble = new Nimble().addLocalServices(TestService, AdditionalService);
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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);

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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
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
    const nimble = new Nimble().addLocalService(TestService);
    const app = new NimblyApi()
      .withErrors({
        [BadLogicError.name]: 400,
        [InternalServerError.name]: 500,
      })
      .from(nimble);
    
    await agent(app)
      .get('/api/test-service/get-bad-logic-error')
      .expect(400, { message: BAD_LOGIC_ERROR_MESSAGE });
    await agent(app)
      .get('/api/test-service/get-internal-server-error')
      .expect(500, { message: INTERNAL_SERVER_ERROR_MESSAGE });
  });

  it('should register routes on an existing app', async () => {
    const existingApp = express();
    existingApp.use(express.urlencoded({ extended: true }));
    existingApp.use(express.json());
    existingApp.use(cors({ origin: "*" }));
    const nimble = new Nimble().addLocalService(TestService);
    const app = new NimblyApi({app: existingApp})
      .withErrors({
        [BadLogicError.name]: 400,
        [InternalServerError.name]: 500,
      })
      .from(nimble);
    
    expect(app).toEqual(existingApp);
  });

});