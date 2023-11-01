import { type Error } from "../../../core/types/error";
import { projectsRepo } from "../projects.repo";
import { pathNotFound, pathToOpenNoValid, projectCreateFails, projectJsonDoesNotExist } from "../projects.errors";
import { trimCharactersFromEnd } from "../../../core/utils/string";
import fs from "fs";
import path from "path";

export async function openProject(projectPath: string): Promise<Error | string> {
  if (!fs.existsSync(projectPath)) {
    return pathNotFound(projectPath);
  }

  const isFile = fs.lstatSync(projectPath).isFile();
  if (isFile && !projectPath.endsWith("project.json")) {
    return pathToOpenNoValid();
  }

  const packageJsonPath = isFile ? projectPath : path.join(projectPath, "project.json");
  if (!fs.existsSync(packageJsonPath)) {
    return projectJsonDoesNotExist(projectPath);
  }

  const basePath = trimCharactersFromEnd(
    projectPath.replace(`${path.sep}project.json`, "").replace(`project.json`, ""),
    path.sep,
  );
  const projectName = basePath.split(path.sep).pop() || "";
  const existingProject = await projectsRepo.getByName(projectName);
  if (existingProject) {
    return projectName;
  }

  const newProject = {
    path: basePath,
    name: projectName,
  };
  return await projectsRepo
    .add(newProject)
    .then((_) => {
      return projectName;
    })
    .catch((error) => {
      console.error(`${projectName} not created due to: ${error.message}.`);
      return projectCreateFails(projectName, error.message);
    });
}
