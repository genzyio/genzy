import fs from "fs";
import path from "path";
import { Router, type Request, type Response } from "express";
import { CreateProject, type Project } from "./projects.models";
import eventEmitter from "../../core/events/events.utils";
import { ProjectCreated, ProjectDeleted } from "./projects.events";
import { projectsRepo } from "./projects.repo";
import { PathNotFound, ProjectAlreadyExists, ProjectDoesNotExistError } from "./projects.errors";

const projectRouters = Router();

projectRouters.get("/projects", async (req: Request, res: Response) => {
  const projects = await projectsRepo.Get();

  return res.status(200).send(projects);
});

projectRouters.post("/projects", async (req: Request, res: Response) => {
  const project: Project = req.body;

  if (!fs.existsSync(project.path)) {
    return res.status(404).send(PathNotFound(project.path));
  }

  const existingProject = await projectsRepo.GetByName(project.name);
  if (existingProject) {
    return res.status(409).send(ProjectAlreadyExists(project.name));
  }

  const newProject: CreateProject = {
    name: project.name,
    path: path.join(project.path, project.name),
  };
  await projectsRepo
    .Add(newProject)
    .then((_) => {
      eventEmitter.emit(ProjectCreated, newProject);
      console.log(`${project.name} is created.`);
    })
    .catch((error) => console.log(`${project.name} not created due to: ${error.message}.`));

  return res.status(204).send();
});

projectRouters.delete("/projects/:name", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const deletePhysically = req.query.physical || false;

  const existingProject = await projectsRepo.GetByName(projectName);
  if (!existingProject) {
    return res.status(404).send(ProjectDoesNotExistError(projectName));
  }

  await projectsRepo
    .Delete(existingProject.id)
    .then((_) => {
      eventEmitter.emit(ProjectDeleted, { project: existingProject, deletePhysically });
      console.log(`${projectName} is deleted.`);
    })
    .catch((error) => console.log(`${projectName} not deleted due to: ${error.message}.`));

  return res.status(204).send();
});

export default projectRouters;
