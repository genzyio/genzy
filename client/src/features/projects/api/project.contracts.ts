import { type Project } from "../models/project.models";

type CreateProject = Pick<Project, "name" | "path"> & {};

export type { CreateProject };
