import { type Project } from "./projects.models";
import { config } from "../../config";
import { ensureFolderExists, removeFolder } from "../../core/utils/fs";
import eventEmitter from "../../core/events/events.utils";
import fs from "fs";
import path from "path";

export const ProjectCreated = Symbol.for("ProjectCreated");
export const ProjectDeleted = Symbol.for("ProjectDeleted");

eventEmitter.on(ProjectCreated, (project: Project) => {
  ensureProjectFolderExists(project.path);
  createArtefacts(project);
});

function ensureProjectFolderExists(projectPath: string) {
  ensureFolderExists(projectPath);
}

function createArtefacts(project: Project) {
  const initialWorkspaceScreenshotPath = path.join("res", "images", "initial-workspace.png");
  if (!fs.existsSync(initialWorkspaceScreenshotPath)) return;

  const screenshotsFolderPath = path.join(config.userArtefactsPath, "screenshots");
  ensureFolderExists(screenshotsFolderPath);

  const screenshotArtefactPath = path.join(screenshotsFolderPath, `${project.name}.png`);
  fs.copyFileSync(initialWorkspaceScreenshotPath, screenshotArtefactPath);
}

eventEmitter.on(ProjectDeleted, ({ project, deletePhysically }: { project: Project; deletePhysically: boolean }) => {
  if (!deletePhysically) {
    return;
  }

  removeFolder(project.path);
});
