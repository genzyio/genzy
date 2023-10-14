import realAxios from 'axios';
import { RemoteProxyOf } from '../src/remote-proxy';
import { ServiceRegistry } from '../src/service-registry';

jest.mock('axios');

const axios = realAxios as jest.Mocked<typeof realAxios>;

class TestService {
  async getAll() {}
  async addSomething(test) {}
  async updateSomething(test) {}
  async deleteSomething(test) {}
}

const serviceRegistry = new ServiceRegistry();

describe('RemoteProxyOf', () => {
  it('should send get request with expected args and default origin', async () => {
    const origin = 'http://localhost';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      url: origin + '/test-service/get-all'
    });

    expect(result).toEqual([1]);
  });

  it('should send post request with provided origin', async () => {
    const origin = 'http://test-origin';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.addSomething(arg);

    expect(axios).toBeCalledWith({
      method: 'post',
      data: arg,
      headers: {},
      url: origin + '/test-service/add-something'
    });

    expect(result).toEqual([1]);
  });

  it('should send put request with provided origin', async () => {
    const origin = 'http://test-put-origin';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.updateSomething(arg);

    expect(axios).toBeCalledWith({
      method: 'put',
      data: arg,
      headers: {},
      url: origin + '/test-service/update-something'
    });

    expect(result).toEqual([1]);
  });

  it('should send delete request with provided origin and multiple args', async () => {
    const origin = 'http://origin';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.deleteSomething(arg);

    expect(axios).toBeCalledWith({
      method: 'delete',
      data: null, // because delete has no body
      headers: {},
      url: origin + '/test-service/delete-something'
    });

    expect(result).toEqual([1]);
  });

  it('should return class name', async () => {
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, 'http://localhost', serviceRegistry);

    expect((testServiceProxy as any)._class_name_).toEqual('TestService');
  });
});