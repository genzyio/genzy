import { Router, type Request, type Response } from "express";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { startProject, stopProject } from "./processes.manager";
import path from "path";
import fs from "fs";

const watchProjectRouters = Router();

// Mozda nekako da track ako je watch mode on/off?
watchProjectRouters.post("/projects/:name/watch/start", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  const projectJsonPath = path.join(existingProject.path, "project.json");
  const projectDefinition = loadProjectDefinition(projectJsonPath);
  await startProject(existingProject, projectDefinition);

  return res.status(200).send();
});

watchProjectRouters.post("/projects/:name/watch/stop", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  await stopProject(existingProject);

  return res.status(200).send();
});

function loadProjectDefinition(projectJsonPath: string) {
  const projectJsonContent = fs.readFileSync(projectJsonPath).toString();
  const projectDefinition = JSON.parse(projectJsonContent);
  return {
    microservices: projectDefinition.microservices,
  };
}

export default watchProjectRouters;
