import { type Project, type ProjectId } from "../projects/projects.models";

import { type Flavor } from "../../core/types/flaworing";

type RecentlyOpenedId = Flavor<number, "RecentlyOpened">;

type RecentlyOpened = {
  id: RecentlyOpenedId;
  projectId: ProjectId;
  openedAt: string;
};

type RecentlyOpenedProject = Omit<RecentlyOpened, "id" | "projectId"> & Omit<Project, "id">;

type CreateRecentlyOpened = Omit<RecentlyOpened, "id" | "openedAt"> & {};

export type { RecentlyOpened, RecentlyOpenedId, CreateRecentlyOpened, RecentlyOpenedProject };
