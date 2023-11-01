import { type CreateProject } from "../projects.models";
import { type Error } from "../../../core/types/error";
import { projectsRepo } from "../projects.repo";
import { pathNotFound, projectAlreadyExists, projectCreateFails } from "../projects.errors";
import { ProjectCreated } from "../projects.events";
import eventEmitter from "../../../core/events/events.utils";
import fs from "fs";
import path from "path";

export async function createProject(project: CreateProject): Promise<Error | undefined> {
  if (!fs.existsSync(project.path)) {
    return pathNotFound(project.path);
  }

  const existingProject = await projectsRepo.getByName(project.name);
  if (existingProject) {
    return projectAlreadyExists(project.name);
  }

  const newProject: CreateProject = {
    name: project.name,
    path: path.join(project.path, project.name),
  };

  return await projectsRepo
    .add(newProject)
    .then((_) => {
      eventEmitter.emit(ProjectCreated, newProject);
      console.log(`${project.name} is created.`);
      return undefined;
    })
    .catch((error) => {
      console.error(`${project.name} not created due to: ${error.message}.`);
      return projectCreateFails(project.name, error.message);
    });
}
