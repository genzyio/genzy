import { Application } from "express";
import { RegisterRoutesFor } from "../src/routes-handler";

const handlers = {};

const app = {
  get: jest.fn(
    (route: string, handler) => (handlers[route] = jest.fn(handler))
  ),
  put: jest.fn(
    (route: string, handler) => (handlers[route] = jest.fn(handler))
  ),
  post: jest.fn(
    (route: string, handler) => (handlers[route] = jest.fn(handler))
  ),
  delete: jest.fn(
    (route: string, handler) => (handlers[route] = jest.fn(handler))
  ),
  listen: jest.fn(),
} as any as Application;

const invokeRequestHandler = (route: string, body: any, params?: any) => {
  const res = {
    locals: { _genzy_result: null },
    json: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  };
  const key = Object.keys(handlers).find((key) =>
    route.startsWith(key.replace(/:.*/g, ""))
  );
  handlers[key as any]({ body, params }, res, () => {});
  return res;
};

class TestService {
  $genzy = {
    path: "/tests",
    actions: {
      deleteSomething: {
        path: "/delete-something/:id",
      },
    },
  };
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

describe("RegisterRoutesFor", () => {
  it("should register all GET routes of the service", async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedGetRoute = "/api/tests/get-all";
    expect(app.get).toBeCalledWith(
      expectedGetRoute,
      expect.anything(),
      expect.anything()
    );

    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedGetRoute, arg);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.locals._genzy_result).toStrictEqual(
      await testServiceInstance.getAll()
    );
  });

  it("should register all POST routes of the service", async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedPostRoute = "/api/tests/add-something";
    expect(app.post).toBeCalledWith(
      expectedPostRoute,
      expect.anything(),
      expect.anything()
    );

    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedPostRoute, arg);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.locals._genzy_result).toStrictEqual(
      await testServiceInstance.addSomething(arg)
    );
  });

  it("should register all PUT routes of the service", async () => {
    RegisterRoutesFor(new TestService(), app);

    const expectedPutRoute = "/api/tests/update-something";
    expect(app.put).toBeCalledWith(
      expectedPutRoute,
      expect.anything(),
      expect.anything()
    );

    const arg = { test: "asdf" };
    const res = invokeRequestHandler(expectedPutRoute, arg);

    await new Promise((r) => setTimeout(r, 200));

    expect(res.locals._genzy_result).toStrictEqual(
      await testServiceInstance.updateSomething(arg)
    );
  });

  it("should register all DELETE routes of the service", async () => {
    RegisterRoutesFor(new TestService(), app);

    const id = "asdf";
    const expectedDeleteRegisterRoute = "/api/tests/delete-something/:id";
    const expectedDeleteCallRoute = "/api/tests/delete-something/" + id;
    expect(app.delete).toBeCalledWith(
      expectedDeleteRegisterRoute,
      expect.anything(),
      expect.anything()
    );

    const secArg = { lala: "po" };
    const res = invokeRequestHandler(expectedDeleteCallRoute, secArg, { id });

    await new Promise((r) => setTimeout(r, 200));

    expect(res.locals._genzy_result).toStrictEqual(
      await testServiceInstance.deleteSomething(id, secArg)
    );
  });
});
