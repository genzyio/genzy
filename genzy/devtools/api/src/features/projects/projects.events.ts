import fs from "fs";
import path from "path";
import eventEmitter from "../../core/events/events.utils";
import { Project } from "./projects.models";
import { config } from "../../config";

export const ProjectCreated = Symbol.for("ProjectCreated");
export const ProjectDeleted = Symbol.for("ProjectDeleted");

eventEmitter.on(ProjectCreated, (project: Project) => {
  createProject(project);
  createArtefacts(project);
});

function createProject(project: Project) {
  !fs.existsSync(project.path) && fs.mkdirSync(project.path);
  fs.writeFileSync(
    path.join(project.path, "project.json"),
    JSON.stringify({
      data: {},
      metadata: { elements: {}, viewports: { microservices: { x: 0, y: 0, zoom: 1 } } },
    }),
  );
}

function createArtefacts(project: Project) {
  const initialWorkspaceScreenshotPath = path.join("res", "images", "initial-workspace.png");
  if (!fs.existsSync(initialWorkspaceScreenshotPath)) return;

  const screenshotArtefactPath = path.join(config.userArtefactsPath, "screenshots", `${project.name}.png`);
  fs.copyFileSync(initialWorkspaceScreenshotPath, screenshotArtefactPath);
}

eventEmitter.on(ProjectDeleted, ({ project, deletePhysically }: { project: Project; deletePhysically: boolean }) => {
  if (!deletePhysically) {
    return;
  }

  fs.rmSync(project.path, { recursive: true, force: true });
});
