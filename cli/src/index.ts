import yargs from "yargs";
import { generateMicroservice, initializeProject, startMicroservice, stopMicroservice } from "./actions";
import { startGn1mbly } from "gn1mbly-api";
import { generateJSClient } from "@n1mbly/cli";

// this forces the main function in @n1mbly/cli to run only when the file is executed directly
process.env.DONT_RUN_MAIN = "true";

main();

async function main() {
  const argv = await yargs
    .usage("Usage: $0 <command> [options]")
    .command(
      "serve [port]",
      "Generate a microservice project",
      (y) =>
        y.positional("port", {
          type: "number",
          default: "4000",
          demandOption: true,
        }),
      (cmd) => {
        console.log(cmd);
        startGn1mbly(cmd.port);
        generateJSClient(
          {
            services: [
              {
                name: "Test",
                actions: [
                  {
                    name: "test",
                    params: [
                      {
                        name: "pera",
                        type: "string",
                      },
                    ],
                  },
                ],
                type: "LocalService",
                dependencies: [],
              },
            ],
            types: {},
          },
          "pera",
          "http://localhost:4000",
        );
      },
    )
    .command(
      "generate [data]",
      "Generate a microservice project",
      (y) =>
        y
          .positional("data", {
            type: "string",
            default: "{}",
            demandOption: true,
          })
          .option("outputDir", {
            alias: "o",
            describe: "Output directory",
            type: "string",
            demandOption: true,
          })
          .option("lang", {
            alias: "l",
            describe: "Language",
            default: "ts",
            type: "string",
            demandOption: false,
            choices: ["js", "ts", "cs"],
          }),
      (cmd) => {
        generateMicroservice(cmd.outputDir, cmd.lang, cmd.data);
      },
    )
    .command(
      "start",
      "Start a microservice",
      (y) =>
        y.option("path", {
          describe: "Path to directory",
          type: "string",
          demandOption: true,
        }),
      (cmd) => {
        startMicroservice(cmd.path);
      },
    )
    .command(
      "stop",
      "Stop a microservice",
      (y) =>
        y.option("path", {
          describe: "Path to directory",
          type: "string",
          demandOption: true,
        }),
      (cmd) => {
        stopMicroservice(cmd.path);
      },
    )
    .command(
      "init",
      "Initialize a project",
      (y) =>
        y
          .option("path", {
            describe: "Path to directory",
            type: "string",
            demandOption: true,
          })
          .option("name", {
            describe: "Project name",
            type: "string",
            demandOption: true,
          }),

      (cmd) => {
        initializeProject(cmd.path, cmd.name);
      },
    )
    .help()
    .wrap(null).argv;

  console.log(JSON.stringify(argv));
}

// npm run build
// node .\dist\src\index.js <command> [options]
