"use strict";
import * as yargs from "yargs";
import * as nunjucks from "nunjucks";
import { generate as generateJS } from "./js-generator";
import { generate as generateTS } from "./ts-generator";
import { generate as generateCS } from "./cs-generator";
import * as path from "path";
import { fetchMeta, readFile } from "./utils";

const options = yargs
  .usage("Usage: -l <language> -h <host> -o")
  .option("l", {
    alias: "language",
    describe: "Target language",
    type: "string",
    demandOption: true,
    choices: ["js", "ts", "cs"],
  })
  .option("h", {
    alias: "host",
    describe: "Target API URL (including the base path like '/api')",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "outDir",
    describe: "Output directory",
    type: "string",
    demandOption: true,
  }).argv as any;

const env = nunjucks.configure(
  path.resolve(__dirname, "./views-" + options.language),
  { autoescape: true },
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
  true,
);

//TODO: maybe add option for JSON file or url, for now only url data
const meta = fetchMeta(options.host);
//const meta = readFile(options.host);

switch (options.language) {
  case "js":
    generateJS(meta, options.host, options.outDir, env);
    break;
  case "ts":
    generateTS(meta, options.host, options.outDir, env);
    break;
  case "cs":
    generateCS(meta, options.host, options.outDir, env);
    break;
  default:
    break;
}
