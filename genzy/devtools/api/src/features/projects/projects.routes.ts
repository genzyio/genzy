import fs from "fs";
import path from "path";
import { Router, type Request, type Response } from "express";
import { type CreateProject, type ImportProject } from "./projects.models";
import eventEmitter from "../../core/events/events.utils";
import { ProjectDeleted } from "./projects.events";
import { projectsRepo } from "./projects.repo";
import { projectAlreadyExists, projectDoesNotExistError, projectJsonDoesNotExist } from "./projects.errors";
import { trimCharactersFromEnd } from "../../core/utils/string";
import { createProject } from "./commands/create-project";

const projectRouters = Router();

projectRouters.get("/projects", async (req: Request, res: Response) => {
  const projects = await projectsRepo.get();

  return res.status(200).send(projects);
});

projectRouters.get("/projects/:name", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  return res.status(200).send(existingProject);
});

projectRouters.post("/projects", async (req: Request, res: Response) => {
  const project: CreateProject = req.body;

  const error = await createProject(project);
  if (error) {
    switch (error.type) {
      case "PathNotFound":
        res.status(404);
        break;
      case "ProjectAlreadyExists":
        res.status(409);
        break;
      default:
        res.status(500);
    }

    res.send(error);
    return;
  }

  return res.status(201).send();
});

projectRouters.post("/projects/import", async (req: Request, res: Response) => {
  const project: ImportProject = req.body;

  const projectPath = trimCharactersFromEnd(project.path, path.sep);
  const projectName = projectPath.split(path.sep).pop() || "";

  const createProject: CreateProject = {
    name: projectName,
    path: project.path,
  };

  if (!fs.existsSync(path.join(project.path, "project.json"))) {
    return res.status(404).send(projectJsonDoesNotExist(project.path));
  }

  const existingProject = await projectsRepo.getByName(createProject.name);
  if (existingProject) {
    return res.status(409).send(projectAlreadyExists(createProject.name));
  }

  await projectsRepo
    .add(createProject)
    .then((_) => {
      console.log(`${createProject.name} is imported.`);
    })
    .catch((error) => console.log(`${createProject.name} not imported due to: ${error.message}`));

  return res.status(201).send(createProject);
});

projectRouters.delete("/projects/:name", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const deletePhysically = req.query.physical === "true";

  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  await projectsRepo
    .remove(existingProject.id)
    .then((_) => {
      eventEmitter.emit(ProjectDeleted, { project: existingProject, deletePhysically });
      console.log(`${projectName} is deleted.`);
    })
    .catch((error) => console.log(`${projectName} not deleted due to: ${error.message}.`));

  return res.status(204).send();
});

export default projectRouters;
