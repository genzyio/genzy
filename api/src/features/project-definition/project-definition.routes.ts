import path from "path";
import fs from "fs";
import { Router, type Request, type Response } from "express";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";

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

  const projectDefinition = JSON.stringify(req.body, null, 4);
  fs.writeFileSync(path.join(existingProject.path, "project.json"), projectDefinition);

  return res.status(200).send();
});

export default projectDefinitionRouters;
