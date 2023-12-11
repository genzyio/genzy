import { type GenzyInfo } from "../utils/converter/genzy.types";
import { type Project } from "../features/projects/projects.models";
import { type Plugin } from "./plugins";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

type InitialGenzyMetadata = GenzyInfo & {
  plugins: Plugin[];
};

function reinitializeMicroservicePackageJson(
  project: Project,
  oldMetadata: InitialGenzyMetadata,
  newMetadata: InitialGenzyMetadata,
) {
  const { name, version, description } = newMetadata;
  const microservicePath = path.join(project.path, name);
  const packageJsonPath = path.join(microservicePath, "package.json");
  const packageJsonContent = fs.readFileSync(packageJsonPath).toString();
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.name = name;
  packageJson.version = version;
  packageJson.description = description;
  packageJson.dependencies = computeNewPluginsObject(
    packageJson.dependencies,
    oldMetadata.plugins || [],
    newMetadata.plugins || [],
  );

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  runNPMInstall(microservicePath);
}

function computeNewPluginsObject(
  currentPluginsObject: Record<string, string>,
  oldPlugins: Plugin[],
  newPlugins: Plugin[],
) {
  const { added, modified, removed } = findPluginsDiff(oldPlugins, newPlugins);

  added.forEach((newPlugin) => (currentPluginsObject[newPlugin.name] = newPlugin.version));
  modified.forEach((updatedPlugin) => (currentPluginsObject[updatedPlugin.name] = updatedPlugin.version));
  removed.forEach((removedPlugin) => delete currentPluginsObject[removedPlugin.name]);

  return currentPluginsObject;
}

function findPluginsDiff(oldPlugins: Plugin[], newPlugins: Plugin[]) {
  return {
    added: newPlugins.filter((newPlugin) => oldPlugins.every((oldPlugin) => oldPlugin.name !== newPlugin.name)),
    modified: newPlugins.filter((newPlugin) =>
      oldPlugins.some((oldPlugin) => newPlugin.name === oldPlugin.name && newPlugin.version !== oldPlugin.version),
    ),
    removed: oldPlugins.filter((oldPlugin) => newPlugins.every((newPlugin) => oldPlugin.name !== newPlugin.name)),
  };
}

function runNPMInstall(runOnPath: string) {
  exec("npm install", { cwd: runOnPath });
}

export { reinitializeMicroservicePackageJson };
