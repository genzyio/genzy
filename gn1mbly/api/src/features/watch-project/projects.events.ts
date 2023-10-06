import { type Project } from "../projects/projects.models";
import { ProjectCreated } from "../projects/projects.events";
import eventEmitter from "../../core/events/events.utils";
import fs from "fs";
import path from "path";

eventEmitter.on(ProjectCreated, (project: Project) => {
  !fs.existsSync(project.path) && fs.mkdirSync(project.path);

  fs.writeFileSync(path.join(project.path, "ports.json"), JSON.stringify({}));
});
