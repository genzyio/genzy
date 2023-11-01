import { type Error } from "../../core/types/error";

function projectDoesNotExistError(projectName: string): Error {
  return {
    type: "ProjectDoesNotExist",
    message: `Project '${projectName}' does not exist.`,
  };
}

function pathNotFound(projectPath: string): Error {
  return {
    type: "PathNotFound",
    message: `Path '${projectPath}' does not exist on the file system.`,
  };
}

function projectAlreadyExists(projectName: string): Error {
  return {
    type: "ProjectAlreadyExists",
    message: `Project '${projectName}' already exists.`,
  };
}

function projectCreateFails(projectName: string, errorMessage: string): Error {
  return {
    type: "ProjectCreateFails",
    message: `${projectName} not created due to: ${errorMessage}.`,
  };
}

function projectJsonDoesNotExist(projectPath: string): Error {
  return {
    type: "ProjectJsonDoesNotExist",
    message: `Path '${projectPath}' does not contain file project.json.`,
  };
}

function pathToOpenNoValid(): Error {
  return {
    type: "PathToOpenNoValid",
    message: `Path to open should be directory or should ends with 'package.json'.`,
  };
}

export {
  projectDoesNotExistError,
  pathNotFound,
  projectAlreadyExists,
  projectCreateFails,
  projectJsonDoesNotExist,
  pathToOpenNoValid,
};
