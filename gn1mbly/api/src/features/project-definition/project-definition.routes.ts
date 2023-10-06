import path from "path";
import fs from "fs";
import { Router, type Request, type Response } from "express";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { ProjectDefinitionSaved } from "./project-definition.events";
import eventEmitter from "../../core/events/events.utils";

const projectDefinitionRouters = Router();

projectDefinitionRouters.get("/projects/:name/definition", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  const projectDefinition = fs.createReadStream(path.join(existingProject.path, "project.json"));

  return projectDefinition.pipe(res);
});

projectDefinitionRouters.put("/projects/:name/definition", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  const projectJsonPath = path.join(existingProject.path, "project.json");
  const oldProjectDefinition = loadProjectDefinition(projectJsonPath);
  const { projectDefinition: newProjectDefinition, states } = req.body;
  eventEmitter.emit(ProjectDefinitionSaved, {
    project: existingProject,
    oldProjectDefinition,
    newProjectDefinition,
    states,
  });
  fs.writeFileSync(projectJsonPath, JSON.stringify(newProjectDefinition, null, 4));

  return res.status(200).send();
});

function loadProjectDefinition(projectJsonPath: string) {
  const projectJsonContent = fs.readFileSync(projectJsonPath).toString();
  const projectDefinition = JSON.parse(projectJsonContent);
  return {
    microservices: projectDefinition.microservices,
  };
}

export default projectDefinitionRouters;
