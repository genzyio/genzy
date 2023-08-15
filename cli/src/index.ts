"use strict";
import * as yargs from "yargs";
import * as nunjucks from "nunjucks";
import { generate as generateJS } from "./js-generator";
import { generate as generateTS } from "./ts-generator";
import { generate as generateCS } from "./cs-generator";
import * as path from "path";
import { fetchMeta, readMetaFromFile } from "./utils";
const options = yargs
  .usage("Usage: -l <language> -h <host> -o <out_dir> -f -server")
  .option("l", {
    alias: "language",
    describe: "Target language",
    type: "string",
    demandOption: true,
    choices: ["js", "ts", "cs"],
  })
  .option("s", {
    alias: "isServer",
    describe: "Is target a server code",
    type: "boolean",
    demandOption: false,
  })
  .option("h", {
    alias: "host",
    describe: "Target API URL (including the base path like '/api')",
    type: "string",
    demandOption: false,
  })
  .option("f", {
    alias: "filePath",
    describe: "Path to meta JSON file",
    type: "string",
    demandOption: false,
  })
  .option("o", {
    alias: "outDir",
    describe: "Output directory",
    type: "string",
    demandOption: true,
  }).argv as any;

const env = nunjucks.configure(
  path.resolve(__dirname, "./views-" + options.language),
  { autoescape: true }
);
env.addFilter(
  "capitalizeFirstLetter",
  function (val, cb) {
    if (!val) {
      cb(null, val);
      return;
    }
    cb(null, `${val[0].toUpperCase()}${val.substring(1)}`);
  },
  true
);

main();

async function main() {
  if (!options.filePath && !options.host) {
    throw new Error("You must provide either a host or a file path.");
  }
  const meta = await (options.filePath
    ? readMetaFromFile(options.filePath)
    : fetchMeta(options.host));

  switch (options.language) {
    case "js":
      generateJS(meta, options.host, options.outDir, env, options.isServer);
      break;
    case "ts":
      generateTS(meta, options.host, options.outDir, env, options.isServer);
      break;
    case "cs":
      if (options.isServer) {
        throw new Error(
          "There is no support for generating CS server code yet!"
        );
      }
      generateCS(
        meta,
        options.host ?? "http://localhost:3000/api",
        options.outDir,
        env,
        options.isServer
      );
      break;
    default:
      break;
  }
}
