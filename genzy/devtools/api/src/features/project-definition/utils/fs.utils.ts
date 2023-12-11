import { type ProjectDefinition } from "../project-definition.models";
import { loadObject, saveObject } from "../../../core/utils/fs";
import fs from "fs";
import path from "path";

const projectJsonFileName = "project.json";

function createProjectDefinitionStream(projectPath: string) {
  const projectJsonPath = path.join(projectPath, projectJsonFileName);

  return fs.createReadStream(projectJsonPath);
}

function loadProjectDefinition(projectPath: string): ProjectDefinition {
  const projectJsonPath = path.join(projectPath, projectJsonFileName);

  return loadObject<ProjectDefinition>(projectJsonPath);
}

function saveProjectDefinition(projectDefinition: ProjectDefinition, projectPath: string) {
  const projectJsonPath = path.join(projectPath, projectJsonFileName);

  saveObject<ProjectDefinition>(projectDefinition, projectJsonPath);
}

export { createProjectDefinitionStream, loadProjectDefinition, saveProjectDefinition };
