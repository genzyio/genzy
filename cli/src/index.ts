"use strict";
import * as yargs from "yargs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { fetchMeta, readMetaFromFile } from "./utils";
import { langToClientViewsDir, langToServerViewsDir } from "./constants";

import { generate as generateJS } from "./javascript/client-generator";
import { generate as generateTS } from "./typescript/client-generator";
import { generate as generateCS } from "./csharp/client-generator";

import { generate as generateServerJS } from "./javascript/server-generator";
import { generate as generateServerTS } from "./typescript/server-generator";

import type { ExtendedMetaInfo } from "./types";

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
  path.resolve(
    __dirname,
    (options.isServer ? langToServerViewsDir : langToClientViewsDir)[
      options.language
    ]
  ),
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
      if (options.isServer) {
        generateServerJS({ meta, dirPath: options.outDir, nunjucks: env });
      } else {
        generateJS({
          meta,
          url: options.host,
          dirPath: options.outDir,
          nunjucks: env,
        });
      }
      break;
    case "ts":
      if (options.isServer) {
        generateServerTS({
          meta: meta as ExtendedMetaInfo,
          dirPath: options.outDir,
          nunjucks: env,
        });
      } else {
        generateTS({
          meta,
          url: options.host,
          dirPath: options.outDir,
          nunjucks: env,
        });
      }
      break;
    case "cs":
      if (options.isServer) {
        throw new Error(
          "There is no support for generating CS server code yet!"
        );
      }
      generateCS({
        meta,
        url: options.host,
        dirPath: options.outDir,
        nunjucks: env,
      });
      break;
    default:
      break;
  }
}
