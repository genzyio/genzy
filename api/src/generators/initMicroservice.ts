import { type N1mblyInfo } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

function initMicroserviceTsJs(project: Project, metadata: N1mblyInfo, lang: "ts" | "js" = "ts") {
  const { name, version, description } = metadata;
  const microservicePath = path.join(project.path, name);

  !fs.existsSync(microservicePath) && fs.mkdirSync(microservicePath);

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
          "@n1mbly/api": "0.2.1",
          "@n1mbly/client": "0.2.0",
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

  const microserviceSourcePath = path.join(microservicePath, "src");
  !fs.existsSync(microserviceSourcePath) && fs.mkdirSync(microserviceSourcePath);

  exec("npm install", { cwd: microservicePath });
}

function reinitializeMicroservicePackageJson(project: Project, metadata: N1mblyInfo) {
  const { name, version, description } = metadata;
  const microservicePath = path.join(project.path, name);
  const packageJsonPath = path.join(microservicePath, "package.json");
  const packageJsonContent = fs.readFileSync(packageJsonPath).toString();
  const packageJson = JSON.parse(packageJsonContent);

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(
      {
        ...packageJson,
        name,
        version,
        description,
      },
      null,
      2,
    ),
  );
}

export { initMicroserviceTsJs, reinitializeMicroservicePackageJson };
