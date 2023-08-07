function ProjectDoesNotExistError(projectName: string) {
  return {
    error: "ProjectDoesNotExist",
    message: `Project '${projectName}' does not exist.`,
  };
}

function PathNotFound(projectPath: string) {
  return {
    error: "PathNotFound",
    message: `Path '${projectPath}' does not exist on the file system.`,
  };
}

function ProjectAlreadyExists(projectName: string) {
  return {
    error: "ProjectAlreadyExists",
    message: `Project '${projectName}' already exists.`,
  };
}

export { ProjectDoesNotExistError, PathNotFound, ProjectAlreadyExists };
