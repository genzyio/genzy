import fs from "fs";
import path from "path";
import eventEmitter from "../../core/events/events.utils";
import { Project } from "./projects.models";

export const ProjectCreated = Symbol.for("ProjectCreated");
export const ProjectDeleted = Symbol.for("ProjectDeleted");

eventEmitter.on(ProjectCreated, (project: Project) => {
  fs.mkdirSync(project.path);
  fs.writeFileSync(
    path.join(project.path, "project.json"),
    JSON.stringify({ microservices: { nodes: [], edges: [], viewport: {} }, services: {}, classes: {} })
  );
});

eventEmitter.on(ProjectDeleted, ({ project, deletePhysically }: { project: Project; deletePhysically: boolean }) => {
  if (!deletePhysically) {
    return;
  }

  fs.rmdirSync(project.path, { recursive: true });
});
