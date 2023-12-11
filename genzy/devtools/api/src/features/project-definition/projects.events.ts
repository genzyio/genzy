import { type Project } from "../projects/projects.models";
import { type ProjectDefinition } from "./project-definition.models";
import { ProjectCreated } from "../projects/projects.events";
import { ensureFolderExists, saveObject } from "../../core/utils/fs";
import eventEmitter from "../../core/events/events.utils";
import path from "path";

eventEmitter.on(ProjectCreated, (project: Project) => {
  ensureProjectFolderExists(project.path);
  createInitialProjectDefinitionFile(project.path);
});

function ensureProjectFolderExists(projectPath: string) {
  ensureFolderExists(projectPath);
}

const initialProjectDefinition = {
  data: {},
  metadata: { elements: {}, viewports: { microservices: { x: 0, y: 0, zoom: 1 } } },
};

function createInitialProjectDefinitionFile(projectPath: string) {
  const projectDefinitionPath = path.join(projectPath, "project.json");

  saveObject<ProjectDefinition>(initialProjectDefinition, projectDefinitionPath);
}
