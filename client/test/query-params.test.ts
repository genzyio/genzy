import realAxios from 'axios';
import { RemoteProxyOf } from '../src/remote-proxy';
import { ServiceRegistry } from '../src/service-registry';
import { Post, Query } from '../../shared/decorators';

jest.mock('axios');

const axios = realAxios as jest.Mocked<typeof realAxios>;

class TestService {
  async getAll(@Query('test') test?: string) {}
  @Post('/:first/:third')
  async test(first: string, @Query('second') second: boolean, third: string, body: any) {}
}

const serviceRegistry = new ServiceRegistry();

describe('Query Params', () => {
  it('should not send a query param if not passed as an argument', async () => {
    const origin = 'http://localhost/';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll();

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      url: origin + 'api/test-service/get-all'
    });

    expect(result).toEqual([1]);
  });

  it('should send a query param if not passed as an argument', async () => {
    const origin = 'http://localhost/';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    (axios as any).mockResolvedValue({ data: [1] });

    const result = await testServiceProxy.getAll('testing');

    expect(axios).toBeCalledWith({
      method: 'get',
      data: null,
      headers: {},
      params: { test: 'testing' },
      url: origin + 'api/test-service/get-all'
    });

    expect(result).toEqual([1]);
  });

  it('should send a arguments in correct order', async () => {
    const origin = 'http://localhost/';
    const testServiceProxy = RemoteProxyOf<TestService>(TestService, origin, serviceRegistry);
    const body = { random: 1 };
    (axios as any).mockResolvedValue({ data: body });

    const result = await testServiceProxy.test('first', false, 'third', body);

    expect(axios).toBeCalledWith({
      method: 'post',
      data: body,
      headers: {},
      params: { second: false },
      url: origin + 'api/test-service/first/third'
    });

    expect(result).toEqual(body);
  });
});