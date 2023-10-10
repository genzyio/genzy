// this forces the main function in @n1mbly/cli to run only when the file is executed directly
process.env.DONT_RUN_MAIN = "true";

import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config";
import { ensureArtefactsFolderExist } from "./core/artefacts/artefacts.utils";
import projectRouters from "./features/projects/projects.routes";
import microserviceRouters from "./features/microservices/microservices.routes";
import watchProjectRoutes from "./features/watch-project/watch-project.routes";
import projectDefinitionRouters from "./features/project-definition/project-definition.routes";
import projectScreenshotsRouters from "./features/project-screenshots/project-screenshots.routes";
import recentlyOpenedRouters from "./features/recently-opened/recently-opened.routes";
import imageStreamingRouters from "./features/image-streaming/image-streaming.routes";
import fs from "fs";
import path from "path";

import "./features/watch-project/projects.events";

export const startGn1mbly = (port: number | string) => {
  ensureArtefactsFolderExist();

  const app: Express = express();

  const publicPath = path.join(__dirname, "./public");

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
    .use("/api", microserviceRouters)
    .use("/api", watchProjectRoutes)
    .use("/api", projectDefinitionRouters)
    .use("/api", projectScreenshotsRouters)
    .use("/api", recentlyOpenedRouters)
    .use("/api", imageStreamingRouters);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

if (config.port) {
  startGn1mbly(config.port);
}
