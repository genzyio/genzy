import { Flavor } from "../../core/types/flaworing";

type ProjectId = Flavor<number, "Project">;

type Project = {
  id: ProjectId;
  name: string;
  path: string;
  createdAt: string;
};

type CreateProject = Omit<Project, "id" | "createdAt"> & {};

type ImportProject = Pick<Project, "path"> & {};

export type { Project, ProjectId, CreateProject, ImportProject };
