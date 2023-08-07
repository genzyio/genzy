import { Flavor } from "../../core/types/flaworing";

type ProjectId = Flavor<number, "Project">;

type Project = {
  id: ProjectId;
  name: string;
  path: string;
};

type CreateProject = Omit<Project, "id"> & {};

export type { Project, ProjectId, CreateProject };
