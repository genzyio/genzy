import { type Request, type Response, Router } from "express";
import { type CreateRecentlyOpened } from "./recently-opened.models";
import { recentlyOpenedRepo } from "./recently-opened.repo";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { recentlyOpenedDoesNotExistError } from "./recently-opened.errors";

const recentlyOpenedRouters = Router();

recentlyOpenedRouters.get("/recently-opened", async (req: Request, res: Response) => {
  const recentlyOpenedProjects = await recentlyOpenedRepo.get();

  return res.status(200).send(recentlyOpenedProjects);
});

recentlyOpenedRouters.post("/projects/:name/recently-opened", async (req: Request, res: Response) => {
  const projectName: string = req.params.name || "";

  const existingRecentlyOpened = await recentlyOpenedRepo.getByName(projectName);
  if (existingRecentlyOpened) {
    await recentlyOpenedRepo.update(projectName);
    return res.status(204).send();
  }

  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError);
  }

  const recentlyOpened: CreateRecentlyOpened = {
    projectId: existingProject.id,
  };

  await recentlyOpenedRepo.add(recentlyOpened);

  return res.status(201).send();
});

recentlyOpenedRouters.delete("/projects/:name/recently-opened", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";

  const existingRecentlyOpened = await recentlyOpenedRepo.getByName(projectName);
  if (!existingRecentlyOpened) {
    return res.status(404).send(recentlyOpenedDoesNotExistError);
  }

  await recentlyOpenedRepo.remove(projectName);

  return res.status(204).send();
});

export default recentlyOpenedRouters;
