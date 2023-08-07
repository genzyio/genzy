import express, { type Express } from "express";
import { config } from "./config";
import { ensureArtefactsFolderExist } from "./core/artefacts/artefacts.utils";
import projectRouters from "./features/projects/projects.routes";
import testRouters from "./features/test/test.routes";

ensureArtefactsFolderExist();

const app: Express = express();

app.use(express.json())
   .use("/api", projectRouters)
   .use("/api", testRouters);

app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${config.port}`);
});
