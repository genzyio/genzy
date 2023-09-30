// this forces the main function in @n1mbly/cli to run only when the file is executed directly
process.env.DONT_RUN_MAIN = "true";

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

const microservices = {
  ["PanicJajeMS"]: {
    port: 3001,
    processId: "12312",
  },
};

// find next available port as a maximum of microservices object
const nextPort =
  Object.keys(microservices).reduce((acc, curr) => {
    const key = curr as keyof typeof microservices;
    if (!microservices[key]) return acc;
    const port = microservices[key].port;
    return port > acc ? port : acc;
  }, 3000) + 1;

import net from "net";

// check if nextPort is taken in host machine
const isPortTaken = (port: number) => {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester
      .once("error", (err: any) => (err.code == "EADDRINUSE" ? resolve(true) : reject(err)))
      .once("listening", () => tester.once("close", () => resolve(false)).close())
      .listen(port);
  });
};

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
