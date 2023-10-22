import { type GenzyInfo } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { type Package } from "./plugins";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

type InitialGenzyMetadata = GenzyInfo & {
  packages: Package[];
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
  packageJson.dependencies = computeNewPackagesObject(
    packageJson.dependencies,
    oldMetadata.packages || [],
    newMetadata.packages || [],
  );

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  runNPMInstall(microservicePath);
}

function computeNewPackagesObject(
  currentPackagesObject: Record<string, string>,
  oldPackages: Package[],
  newPackages: Package[],
) {
  const { added, modified, removed } = findPackagesDiff(oldPackages, newPackages);

  added.forEach((newPackage) => (currentPackagesObject[newPackage.name] = newPackage.version));
  modified.forEach((updatedPackage) => (currentPackagesObject[updatedPackage.name] = updatedPackage.version));
  removed.forEach((removedPackage) => delete currentPackagesObject[removedPackage.name]);

  return currentPackagesObject;
}

function findPackagesDiff(oldPackages: Package[], newPackages: Package[]) {
  return {
    added: newPackages.filter((newPackage) => oldPackages.every((oldPackage) => oldPackage.name !== newPackage.name)),
    modified: newPackages.filter((newPackage) =>
      oldPackages.some(
        (oldPackage) => newPackage.name === oldPackage.name && newPackage.version !== oldPackage.version,
      ),
    ),
    removed: oldPackages.filter((oldPackage) => newPackages.every((newPackage) => oldPackage.name !== newPackage.name)),
  };
}

function runNPMInstall(runOnPath: string) {
  exec("npm install", { cwd: runOnPath });
}

export { reinitializeMicroservicePackageJson };
