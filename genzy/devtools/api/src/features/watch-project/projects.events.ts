import { type Project } from "../projects/projects.models";
import { ProjectCreated } from "../projects/projects.events";
import { ensureFolderExists, saveObject } from "../../core/utils/fs";
import eventEmitter from "../../core/events/events.utils";
import path from "path";

eventEmitter.on(ProjectCreated, (project: Project) => {
  ensureProjectFolderExists(project.path);
  createPortsMapFile(project.path);
});

function ensureProjectFolderExists(projectPath: string) {
  ensureFolderExists(projectPath);
}

function createPortsMapFile(projectPath: string) {
  const portsMapPath = path.join(projectPath, "ports.json");

  saveObject({}, portsMapPath);
}
