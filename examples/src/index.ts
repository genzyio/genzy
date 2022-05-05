import { Nimble, NimblyApi } from '../../api/src';

class TestService {
  $nimbly = {
    rootPath: 'tests',
    get: {
      method: 'GET',
      path: ':id'
    },
    update: {
      method: 'PUT',
      path: ':id',
      body: true
    }
  }

  get(id) {
    return [1, 2, 3]
  }

  update(id, body) {
    return [1, 2, 3]
  }
}

const api = new NimblyApi().from(new Nimble().ofLocal(TestService));

const PORT = 3000;
api.listen(PORT, () => console.log(`Server listening on port ${PORT}`));