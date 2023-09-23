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

export const startGn1mbly = (port: number | string) => {
  ensureArtefactsFolderExist();

  const app: Express = express();

  const publicPath = join(__dirname, "./public");

  if (fs.existsSync(publicPath)) {
    const indexFilePath = `${publicPath}/index.html`;
    app.get("/", function (req, res) {
      fs.readFile(indexFilePath, function (err, data) {
        if (err) {
          res.sendStatus(404);
        } else {
          const content = data.toString("utf-8");
          const apiUrlPlaceholder = "{{API_URL}}";
          const newContent = content.replace(apiUrlPlaceholder, `http://localhost:${port}/api`);
          res.send(newContent);
        }
      });
    });
    app.use(express.static(publicPath));
  }

  app
    .use(cors())
    .use(express.json())
    .use("/api", projectRouters)
    .use("/api", projectDefinitionRouters)
    .use("/api", projectScreenshotsRouters)
    .use("/api", recentlyOpenedRouters);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

if (config.port) {
  startGn1mbly(config.port);
}
