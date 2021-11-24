import { Nimble, NimblyApi } from "./src/index";

class TestService {
  async getAll() {
    console.log('Invoked')
    return [1, 2, 3];
  }
  addSmth(passed) {
    return {...passed, msg: "WORKS"};
  }
}

const nimble = new Nimble().of(TestService);

const { testService } = nimble.services();

const app = new NimblyApi().from(nimble);

app.listen(4040);