import { Router, type Request, type Response } from "express";
import { type TypesRequest } from "../../core/types/typedRequest";
import { type ProjectDefinition, type States } from "./project-definition.models";
import { projectsRepo } from "../projects/projects.repo";
import { projectDoesNotExistError } from "../projects/projects.errors";
import { ProjectDefinitionSaved } from "./project-definition.events";
import eventEmitter from "../../core/events/events.utils";
import { createProjectDefinitionStream, loadProjectDefinition, saveProjectDefinition } from "./utils/fs.utils";

const projectDefinitionRouters = Router();

projectDefinitionRouters.get("/projects/:name/definition", async (req: Request, res: Response) => {
  const projectName = req.params.name || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (!existingProject) {
    return res.status(404).send(projectDoesNotExistError(projectName));
  }

  return createProjectDefinitionStream(existingProject.path).pipe(res);
});

type UpdateProjectDefinition = {
  projectDefinition: ProjectDefinition;
  states: States;
};

projectDefinitionRouters.put(
  "/projects/:name/definition",
  async (req: TypesRequest<UpdateProjectDefinition>, res: Response) => {
    const projectName = req.params.name || "";
    const existingProject = await projectsRepo.getByName(projectName);
    if (!existingProject) {
      return res.status(404).send(projectDoesNotExistError(projectName));
    }

    const oldProjectDefinition = loadProjectDefinition(existingProject.path);
    const { projectDefinition: newProjectDefinition, states } = req.body;
    eventEmitter.emit(ProjectDefinitionSaved, {
      project: existingProject,
      oldProjectData: oldProjectDefinition.data,
      newProjectData: newProjectDefinition.data,
      states,
    });
    saveProjectDefinition(newProjectDefinition, existingProject.path);

    return res.status(200).send();
  },
);

export default projectDefinitionRouters;
