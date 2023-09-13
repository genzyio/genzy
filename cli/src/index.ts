import yargs from "yargs";

main();

async function main() {
  const argv = await yargs
    .usage("Usage: $0 <command> [options]")
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
        console.log(cmd.lang, cmd.outputDir, cmd.data);
        // TODO: implement
      }
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
        console.log(cmd.path);
        // TODO: implement
      }
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
        console.log(cmd.path, cmd.name);
        // TODO: implement
      }
    )
    .help()
    .wrap(null).argv;

  console.log(JSON.stringify(argv));
}

// npm run build
// node .\dist\src\index.js <command> [options]
