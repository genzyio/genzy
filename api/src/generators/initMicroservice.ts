import { type N1mblyInfo } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { type Package } from "./plugins";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

type InitialN1mblyMetadata = N1mblyInfo & {
  packages: Package[];
};

function initMicroserviceTsJs(project: Project, metadata: InitialN1mblyMetadata, lang: "ts" | "js" = "ts") {
  const { name, version, description } = metadata;
  const microservicePath = path.join(project.path, name);

  !fs.existsSync(microservicePath) && fs.mkdirSync(microservicePath);

  const initialDependencies = metadata.packages.reduce(
    (packages: Record<string, string>, { name, version }: Package) => {
      packages[name] = version;
      return packages;
    },
    {},
  );

  fs.writeFileSync(
    path.join(microservicePath, "package.json"),
    JSON.stringify(
      {
        name,
        version,
        description,
        main: "index.js",
        scripts: {
          start: "ts-node src",
          watch: `nodemon --watch ../ --exec ${
            lang === "ts" ? "./node_modules/.bin/ts-node" : "node"
          } ./src/index.${lang} server --ext ${lang},json`,
          "watch:client": `nodemon --watch ../ --exec ${
            lang === "ts" ? "./node_modules/.bin/ts-node" : "node"
          } ./src/index.${lang} client --ext ${lang},json`,
        },
        keywords: [],
        author: "",
        license: "ISC",
        dependencies: {
          ...initialDependencies,
          "@n1mbly/api": "0.2.10",
          "@n1mbly/client": "0.2.0",
          dotenv: "16.3.1",
        },
        devDependencies: {
          nodemon: "3.0.1",
          ...(lang === "ts" ? { typescript: "5.2.2", "ts-node": "10.9.1" } : {}),
        },
      },
      null,
      2,
    ),
  );

  if (lang === "ts") {
    fs.writeFileSync(
      path.join(microservicePath, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            sourceMap: true,
            target: "es6",
            outDir: "build",
            module: "commonjs",
            experimentalDecorators: true,
          },
          include: ["src/**/*.ts"],
        },
        null,
        2,
      ),
    );
  }

  const microserviceEnvPath = path.join(microservicePath, ".env");
  !fs.existsSync(microserviceEnvPath) && fs.writeFileSync(microserviceEnvPath, "PORT=3000");

  const microserviceSourcePath = path.join(microservicePath, "src");
  !fs.existsSync(microserviceSourcePath) && fs.mkdirSync(microserviceSourcePath);

  exec("npm install", { cwd: microservicePath });
}

function reinitializeMicroservicePackageJson(
  project: Project,
  oldMetadata: InitialN1mblyMetadata,
  newMetadata: InitialN1mblyMetadata,
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

  exec("npm install", { cwd: microservicePath });
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

export { initMicroserviceTsJs, reinitializeMicroservicePackageJson };
