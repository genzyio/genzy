import fs from "fs";
import path from "path";
import eventEmitter from "../../core/events/events.utils";
import { Project } from "./projects.models";

export const PROJECT_CREATED = Symbol.for("ProjectCreated");

eventEmitter.on(PROJECT_CREATED, (project: Project) => {
  fs.mkdirSync(project.path);
  fs.writeFileSync(path.join(project.path, "project.json"), "{\n}");
});