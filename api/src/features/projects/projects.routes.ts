import fs from 'fs';
import path from 'path';
import { Router, type Request, type Response } from "express";
import { type Project } from "./projects.models";
import eventEmitter from "../../core/events/events.utils";
import { PROJECT_CREATED } from "./projects.events";
import { projectsRepo } from "./projects.repo";

const projectRouters = Router();

projectRouters.post("/projects", async (req: Request, res: Response) => {
  const project: Project = req.body;

  if (!fs.existsSync(project.path)) {
    return res.status(404).send({
      error: "PathNotFound",
      message: `Path '${project.path}' does not exist on the file system.`
    });
  }

  const existingProject = await projectsRepo.GetByName(project.name);
  if (existingProject) {
    return res.status(409).send({
      error: "ProjectAlreadyExists",
      message: `Project '${project.name}' already exists.`
    });
  }

  const newProject = {
    name: project.name,
    path: path.join(project.path, project.name)
  };
  await projectsRepo.Add(newProject)
    .then(_ => { eventEmitter.emit(PROJECT_CREATED, newProject); console.log(`${project.name} is created.`); })
    .catch(error => console.log(`${project.name} not created due to: ${error.message}.`));

  return res.status(204).send();
});

export default projectRouters;