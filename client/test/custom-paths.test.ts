import realAxios from 'axios';
import { RemoteProxyOf } from '../src/remote-proxy';
import { ServiceRegistry } from '../src/service-registry';
import { Get, Controller, Post, Put } from '../../shared/decorators';
import { NimblyConfig } from '../../shared/types';

jest.mock('axios');

const axios = realAxios as jest.Mocked<typeof realAxios>;

class TestService {
  $nimbly: NimblyConfig = {
    path: '/tests',
    getAll: {
      httpMethod: 'GET',
      path: ''
    },
    differentAdd: {
      httpMethod: 'POST',
      path: ''
    },
    differentUpdate: {
      httpMethod: 'PUT',
      path: '/:id'
    },
  }

  async getAll() {}
  async differentAdd(test) {}
  async differentUpdate(id, test) {}
}

@Controller('/tests')
class TestServiceDecorated {
  @Get('')
  async getAll() {}
  @Post('')
  async differentAdd(test) {}
  @Put('/:id')
  async differentUpdate(id, test) {}
}

const serviceRegistry = new ServiceRegistry();

describe('Custom Paths', () => {
  it('should send get request to the root path', async () => {
    const origin = 'http://localhost';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      url: origin + '/tests'
    });

    expect(result).toEqual([1]);
  });

  it('should send post request to the root path', async () => {
    const origin = 'http://test-origin';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.differentAdd(arg);

    expect(axios).toBeCalledWith({
      method: 'post',
      data: arg,
      headers: {},
      url: origin + '/tests'
    });

    expect(result).toEqual([1]);
  });

  it('should send put request to the root path with path param', async () => {
    const origin = 'http://test-origin';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.differentUpdate(1, arg);

    expect(axios).toBeCalledWith({
      method: 'put',
      data: arg,
      headers: {},
      url: origin + '/tests/1'
    });

    expect(result).toEqual([1]);
  });

  it('should send get request to the root path decorated', async () => {
    const origin = 'http://localhost';
    const testServiceProxy = RemoteProxyOf<TestServiceDecorated>(TestServiceDecorated, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      url: origin + '/tests'
    });

    expect(result).toEqual([1]);
  });

  it('should send post request to the root path decorated', async () => {
    const origin = 'http://test-origin';
    const testServiceProxy = RemoteProxyOf<TestServiceDecorated>(TestServiceDecorated, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.differentAdd(arg);

    expect(axios).toBeCalledWith({
      method: 'post',
      data: arg,
      headers: {},
      url: origin + '/tests'
    });

    expect(result).toEqual([1]);
  });

  it('should send put request to the root path with path param decorated', async () => {
    const origin = 'http://test-origin';
    const testServiceProxy = RemoteProxyOf<TestServiceDecorated>(TestServiceDecorated, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const arg = { test: "123" };
    const result = await testServiceProxy.differentUpdate(1, arg);

    expect(axios).toBeCalledWith({
      method: 'put',
      data: arg,
      headers: {},
      url: origin + '/tests/1'
    });

    expect(result).toEqual([1]);
  });

  it('should use passed base path', async () => {
    const origin = 'http://test-origin/v1';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry, null);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      url: origin + '/tests'
    });

    expect(result).toEqual([1]);
  });

});