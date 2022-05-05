import { Nimble } from 'nimbly-client';
import { NimblyApi } from '../src/nimbly-api';
import { agent } from 'supertest'
import { RegisterRoutesFor } from '../src/routes-handler';
import * as express from 'express';

class TestService {
  async get() {}
}

describe('NimblyApi Meta Info', () => {

  it('should register meta path', async () => {
    const meta = RegisterRoutesFor(new TestService(), express());

    const nimble = new Nimble().of(TestService);
    const app = new NimblyApi().from(nimble);

    await agent(app)
      .get('/api/meta')
      .expect(200, [meta]);
  });
});