function recentlyOpenedDoesNotExistError(projectName: string) {
  return {
    error: "RecentlyOpenedDoesNotExist",
    message: `Project '${projectName}' was not opened recently.`,
  };
}

export { recentlyOpenedDoesNotExistError };
