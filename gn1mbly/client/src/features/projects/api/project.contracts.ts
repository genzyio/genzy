import { type Project } from "../models/project.models";
import { type ProjectDefinition } from "../models/project-definition.models";

type CreateProject = Pick<Project, "name" | "path"> & {};

type ImportProject = Pick<CreateProject, "path">;

type SaveProjectDefinition = {
  projectDefinition: ProjectDefinition;
  states: Record<string, string>;
};

export type { CreateProject, ImportProject, SaveProjectDefinition };
