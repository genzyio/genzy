import { Router, type Request, type Response } from "express";
import { type Project } from "../projects/projects.models";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { loadProjectDefinition } from "../project-definition/utils/fs.utils";
import { getPids, startProject, stopProject } from "./processes.manager";

const watchProjectRouters = Router();

watchProjectRouters.get("/projects/:name/watch/active", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  return res.status(200).send(getActiveMicroserviceIds(existingProject));
});

watchProjectRouters.post("/projects/:name/watch/start", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  const projectDefinition = loadProjectDefinition(existingProject.path);
  await startProject(existingProject, projectDefinition.data);

  return res.status(200).send(getActiveMicroserviceIds(existingProject));
});

watchProjectRouters.post("/projects/:name/watch/stop", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  await stopProject(existingProject);

  return res.status(200).send(getActiveMicroserviceIds(existingProject));
});

function getActiveMicroserviceIds(project: Project) {
  const pids = getPids(project);
  const microserviceIds = Object.keys(pids);

  return microserviceIds;
}

export default watchProjectRouters;
