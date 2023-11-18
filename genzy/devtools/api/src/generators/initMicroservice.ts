import { type GenzyInfo } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import { type Package } from "./plugins";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

type InitialGenzyMetadata = GenzyInfo & {
  packages: Package[];
};

function initMicroserviceTsJs(project: Project, metadata: InitialGenzyMetadata, lang: "ts" | "js" = "ts") {
  const microservicePath = path.join(project.path, metadata.name);
  !fs.existsSync(microservicePath) && fs.mkdirSync(microservicePath);

  writePackageJson(microservicePath, metadata, lang);
  if (lang === "ts") writeTsConfig(microservicePath);

  writeEnvFileIfNotExisting(microservicePath);
  makeSRCFolderIfNotExisting(microservicePath);
  runNPMInstall(microservicePath);
}

function writePackageJson(basePath: string, metadata: InitialGenzyMetadata, lang: "ts" | "js") {
  const { name, version, description, packages } = metadata;

  const initialDependencies = packages.reduce((packages: Record<string, string>, { name, version }: Package) => {
    packages[name] = version;
    return packages;
  }, {});

  const packageJsonPath = path.join(basePath, "package.json");
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        name,
        version,
        description,
        main: `index.${lang}`,
        ...(lang === "js" ? { type: "module" } : {}),
        scripts: {
          start: `${lang === "ts" ? "ts-node" : "node"} src`,
          watch: `nodemon --watch ../ --exec ${
            lang === "ts" ? "./node_modules/.bin/ts-node" : "node"
          } ./src/index.${lang} server --ext ${lang},json`,
          "watch:client": `nodemon --watch ../ --exec ${
            lang === "ts" ? "./node_modules/.bin/ts-node" : "node"
          } ./src/index.${lang} client --ext ${lang},json`,
        },
        keywords: ["genzy.io"],
        author: "",
        license: "ISC",
        dependencies: {
          ...initialDependencies,
          "@genzy.io/api": "0.0.1-alpha-8",
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
}

function writeTsConfig(basePath: string) {
  fs.writeFileSync(
    path.join(basePath, "tsconfig.json"),
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

function writeEnvFileIfNotExisting(basePath: string) {
  const microserviceEnvPath = path.join(basePath, ".env");
  !fs.existsSync(microserviceEnvPath) && fs.writeFileSync(microserviceEnvPath, "PORT=3000");
}

function makeSRCFolderIfNotExisting(basePath: string) {
  const microserviceSourcePath = path.join(basePath, "src");
  !fs.existsSync(microserviceSourcePath) && fs.mkdirSync(microserviceSourcePath);
}

function runNPMInstall(runOnPath: string) {
  exec("npm install", { cwd: runOnPath });
}

export { initMicroserviceTsJs };
