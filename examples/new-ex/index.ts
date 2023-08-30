// index.ts
import { N1mblyApi } from "../../api/src/n1mbly-api";
import { ExampleService } from "./example";
import { N1mblyContainer } from "../../client/src";

const testContainer = new N1mblyContainer().addLocalService(ExampleService);
const PORT = 3000;

const app = new N1mblyApi().buildAppFrom(testContainer);

app.listen(PORT);
