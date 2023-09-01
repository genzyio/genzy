function projectDoesNotExistError(projectName: string) {
  return {
    error: "ProjectDoesNotExist",
    message: `Project '${projectName}' does not exist.`,
  };
}

function pathNotFound(projectPath: string) {
  return {
    error: "PathNotFound",
    message: `Path '${projectPath}' does not exist on the file system.`,
  };
}

function projectAlreadyExists(projectName: string) {
  return {
    error: "ProjectAlreadyExists",
    message: `Project '${projectName}' already exists.`,
  };
}

function projectJsonDoesNotExist(projectName: string) {
  return {
    error: "ProjectJsonDoesNotExist",
    message: `Project '${projectName}' does not contain file project.json.`,
  };
}

export { projectDoesNotExistError, pathNotFound, projectAlreadyExists, projectJsonDoesNotExist };
