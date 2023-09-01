import path from "path";

export function trimSpecialCharactersFromEnd(projectPath: string) {
  const separator = path.sep.replace(/\\/g, "\\\\");
  const regex = new RegExp(`${separator}+$`);
  return projectPath.replace(regex, "");
}
