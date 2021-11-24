import { Application } from 'express';
import { RegisterRoutesFor } from '../src/routes-handler';

const handlers = {};

const app = {
  get: jest.fn((route: string, handler) => handlers[route] = jest.fn(handler)),
  put: jest.fn((route: string, handler) => handlers[route] = jest.fn(handler)),
  post: jest.fn((route: string, handler) => handlers[route] = jest.fn(handler)),
  delete: jest.fn((route: string, handler) => handlers[route] = jest.fn(handler)),
  listen: jest.fn()
} as any as Application;


const invokeRequestHandler = (route: string, args: any[]) => {
  const res = {
    json: jest.fn()
  };
  handlers[route]({ body: { args: args } }, res);
  return res;
}

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
const testServiceInstance = new TestService();

describe('RegisterRoutesFor', () => {

  it('should register all GET routes of the service', async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedGetRoute = '/api/test-service/get-all';
    expect(app.get).toBeCalledWith(expectedGetRoute, expect.anything());

    
    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedGetRoute, [arg]);

    await new Promise((r) => setTimeout(r, 200));
    
    expect(res.json).toBeCalledWith(await testServiceInstance.getAll());
  });

  it('should register all POST routes of the service', async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedPostRoute = '/api/test-service/add-something';
    expect(app.post).toBeCalledWith(expectedPostRoute, expect.anything());

    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedPostRoute, [arg]);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.json).toBeCalledWith(await testServiceInstance.addSomething(arg));
  });

  it('should register all PUT routes of the service', async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedPutRoute = '/api/test-service/update-something';
    expect(app.put).toBeCalledWith(expectedPutRoute, expect.anything());

    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedPutRoute, [arg]);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.json).toBeCalledWith(await testServiceInstance.updateSomething(arg));
  });

  it('should register all DELETE routes of the service', async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedDeleteRoute = '/api/test-service/delete-something';
    expect(app.delete).toBeCalledWith(expectedDeleteRoute, expect.anything());

    const arg = { test: "asdf" };
    const secArg = { lala: "po" };
    const res = invokeRequestHandler(expectedDeleteRoute, [arg, secArg]);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.json).toBeCalledWith(await testServiceInstance.deleteSomething(arg, secArg));
  });

});