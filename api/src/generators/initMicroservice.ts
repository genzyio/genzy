import { type N1mblyGeneratorInput } from "../utils/converter";
import { type Project } from "../features/projects/projects.models";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

function initMicroserviceTsJs(info: N1mblyGeneratorInput, project: Project, lang: "ts" | "js" = "ts") {
  const { name, version, description } = info.n1mblyInfo;
  const microservicePath = path.join(project.path, name);

  fs.mkdirSync(microservicePath);

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
          "@n1mbly/api": "0.2.0",
          "@n1mbly/client": "0.2.0",
        },
        devDependencies: {
          nodemon: "3.0.1",
          ...(lang === "ts" ? { typescript: "5.2.2", "ts-node": "10.9.1" } : {}),
        },
      },
      null,
      2
    )
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
        2
      )
    );
  }

  fs.mkdirSync(path.join(microservicePath, "src"));

  exec("npm install", { cwd: microservicePath });
}

function installPackage(packageName: string, packageVersion: string, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm install ${packageName}@${packageVersion}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout)
    )
  );
}

function uninstallPackage(packageName: string, packageVersion: string, microservicePath: string): Promise<string> {
  return new Promise((res, rej) =>
    exec(`npm uninstall ${packageName}@${packageVersion}`, { cwd: microservicePath }, (err, stdout, stderr) =>
      err ? rej(stderr) : res(stdout)
    )
  );
}

export { initMicroserviceTsJs, installPackage, uninstallPackage };
