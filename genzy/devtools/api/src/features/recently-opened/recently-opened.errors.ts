import { type Error } from "../../core/types/error";

function recentlyOpenedDoesNotExistError(projectName: string): Error {
  return {
    type: "RecentlyOpenedDoesNotExist",
    message: `Project '${projectName}' was not opened recently.`,
  };
}

export { recentlyOpenedDoesNotExistError };
