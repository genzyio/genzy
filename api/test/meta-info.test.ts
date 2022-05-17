import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'
import { RegisterRoutesFor } from '../src/routes-handler';
import * as express from 'express';
import { boolean, number, Post, Query, Returns, Service, string, type } from '../../shared/decorators';
import { BASIC_TYPES } from '../../shared/constants';

class TestService {
  async get() {}
}

class Example {
  @string test: string;
  @boolean bool: boolean;
  @number num: number;
}

@Service('/')
class Test3Service {
  @Post('/:one/:three')
  @Returns(Example)
  async get(
    @string one: string,
    @Query('two') @number two: number,
    @boolean three: boolean,
    @type(Example) body: Example
  ) {}
}

describe('NimblyApi Meta Info', () => {

  it('should register meta path', async () => {
    const meta = RegisterRoutesFor(new TestService(), express());

    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi().from(nimble);

    await agent(app)
      .get('/api/meta')
      .then((res) => {
        expect(res).not.toBeNull();
        expect(res.status).toBe(200);
        expect(res.body).toStrictEqual([meta]);
      });
  });

  it('should register meta path', async () => {
    const meta = RegisterRoutesFor(new Test3Service(), express());

    const exampleType = {
      ...(new Example() as any).$nimbly_config.types,
      $isArray: false,
      $typeName: 'Example'
    };

    expect(meta.routes).toHaveLength(1);

    const route = meta.routes[0];

    expect(route.body).toBe(true);
    expect(route.bodyType).toStrictEqual(exampleType);
    expect(route.httpMethod).toBe('post');
    expect(route.methodName).toBe('get');
    expect(route.methodPath).toBe('/:one/:three');
    expect(route.path).toBe('/api/:one/:three');
    
    expect(route.pathParamTypes).toHaveLength(2);
    expect(route.pathParamTypes).toContainEqual(BASIC_TYPES.string);
    expect(route.pathParamTypes).toContainEqual(BASIC_TYPES.boolean);
    
    expect(route.pathParams).toHaveLength(2);
    expect(route.pathParams).toContainEqual('one');
    expect(route.pathParams).toContainEqual('three');
    
    expect(route.queryParamTypes).toHaveLength(1);
    expect(route.queryParamTypes).toContainEqual(BASIC_TYPES.number);
    
    expect(route.queryParams).toHaveLength(1);
    expect(route.queryParams).toContainEqual('two');
    
    expect(route.returnType).toStrictEqual(exampleType);
  });
});