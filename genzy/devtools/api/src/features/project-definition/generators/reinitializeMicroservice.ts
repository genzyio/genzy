import { type GenzyInfo } from "../converter/genzy.types";
import { type Project } from "../../projects/projects.models";
import { type Plugin } from "../project-definition.models";
import { loadObject, saveObject } from "../../../core/utils/fs";
import { exec } from "child_process";
import path from "path";

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
  const packageJson = loadObject<any>(packageJsonPath);

  packageJson.name = name;
  packageJson.version = version;
  packageJson.description = description;
  packageJson.dependencies = computeNewPluginsObject(
    packageJson.dependencies,
    oldMetadata.plugins || [],
    newMetadata.plugins || [],
  );

  saveObject<any>(packageJson, packageJsonPath);

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
