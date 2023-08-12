import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config";
import { ensureArtefactsFolderExist } from "./core/artefacts/artefacts.utils";
import projectRouters from "./features/projects/projects.routes";
import projectDefinitionRouters from "./features/project-definition/project-definition.routes";
import projectScreenshotsRouters from "./features/project-screenshots/project-screenshots.routes";

ensureArtefactsFolderExist();

const app: Express = express();

app
  .use(cors())
  .use(express.json())
  .use("/api", projectRouters)
  .use("/api", projectDefinitionRouters)
  .use("/api", projectScreenshotsRouters);

app.listen(config.port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${config.port}`);
});
