import { type Project } from "../models/project.models";

type CreateProject = Pick<Project, "name" | "path"> & {};

type ImportProject = Pick<CreateProject, "path">;

export type { CreateProject, ImportProject };
