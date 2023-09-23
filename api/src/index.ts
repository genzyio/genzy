import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config";
import { ensureArtefactsFolderExist } from "./core/artefacts/artefacts.utils";
import projectRouters from "./features/projects/projects.routes";
import projectDefinitionRouters from "./features/project-definition/project-definition.routes";
import projectScreenshotsRouters from "./features/project-screenshots/project-screenshots.routes";
import recentlyOpenedRouters from "./features/recently-opened/recently-opened.routes";
import fs from "fs";
import { join } from "path";

export const main = () => {
  ensureArtefactsFolderExist();

  const app: Express = express();

  const publicPath = join(__dirname, "./public");

  if (fs.existsSync(publicPath)) {
    const content = fs.readFileSync(`${publicPath}/index.html`).toString("utf-8");
    const apiUrlPlaceholder = "{{API_URL}}";
    const newContent = content.replace(apiUrlPlaceholder, `http://localhost:${config.port}/api`);
    fs.writeFileSync(`${publicPath}/index.html`, newContent);
    app.use(express.static(publicPath));
  }

  app
    .use(cors())
    .use(express.json())
    .use("/api", projectRouters)
    .use("/api", projectDefinitionRouters)
    .use("/api", projectScreenshotsRouters)
    .use("/api", recentlyOpenedRouters);

  app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
  });
};

if (config.port) {
  main();
}
