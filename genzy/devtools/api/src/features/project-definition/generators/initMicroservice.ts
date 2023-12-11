import { type GenzyInfo } from "../converter/genzy.types";
import { type Project } from "../../projects/projects.models";
import { type Plugin } from "../project-definition.models";
import { ensureFileExists, ensureFolderExists, saveObject } from "../../../core/utils/fs";
import { exec } from "child_process";
import path from "path";

type InitialGenzyMetadata = GenzyInfo & {
  language: "ts" | "js";
  plugins: Plugin[];
};

function initMicroservice(project: Project, metadata: InitialGenzyMetadata) {
  const microservicePath = path.join(project.path, metadata.name);
  ensureFolderExists(microservicePath);

  writePackageJson(microservicePath, metadata);
  if (metadata.language === "ts") writeTsConfig(microservicePath);

  ensureEnvFileExists(microservicePath);
  ensureSRCFolderExists(microservicePath);
  runNPMInstall(microservicePath);
}

function writePackageJson(microservicePath: string, metadata: InitialGenzyMetadata) {
  const { name, version, description, language, plugins } = metadata;

  const initialDependencies = plugins.reduce((plugins: Record<string, string>, { name, version }: Plugin) => {
    plugins[name] = version;
    return plugins;
  }, {});

  const packageJsonPath = path.join(microservicePath, "package.json");
  const packageJson = {
    name,
    version,
    description,
    main: `index.${language}`,
    ...(language === "js" ? { type: "module" } : {}),
    scripts: {
      start: `${language === "ts" ? "ts-node" : "node"} src`,
      watch: `nodemon --watch ../ --exec ${
        language === "ts" ? "./node_modules/.bin/ts-node" : "node"
      } ./src/index.${language} server --ext ${language},json`,
      "watch:client": `nodemon --watch ../ --exec ${
        language === "ts" ? "./node_modules/.bin/ts-node" : "node"
      } ./src/index.${language} client --ext ${language},json`,
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
      ...(language === "ts" ? { typescript: "5.2.2", "ts-node": "10.9.1" } : {}),
    },
  };

  saveObject(packageJson, packageJsonPath);
}

function writeTsConfig(microservicePath: string) {
  const tsConfigPath = path.join(microservicePath, "tsconfig.json");
  const tsConfig = {
    compilerOptions: {
      sourceMap: true,
      target: "es6",
      outDir: "build",
      module: "commonjs",
      experimentalDecorators: true,
    },
    include: ["src/**/*.ts"],
  };

  saveObject(tsConfig, tsConfigPath);
}

function ensureEnvFileExists(basePath: string) {
  const microserviceEnvPath = path.join(basePath, ".env");
  ensureFileExists(microserviceEnvPath, "PORT=3000");
}

function ensureSRCFolderExists(basePath: string) {
  const microserviceSourcePath = path.join(basePath, "src");
  ensureFolderExists(microserviceSourcePath);
}

function runNPMInstall(runOnPath: string) {
  exec("npm install", { cwd: runOnPath });
}

export { initMicroservice };
