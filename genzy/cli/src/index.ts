"use strict";
import * as yargs from "yargs";

import { fetchMeta, readMetaFromFile } from "./utils/general";

import { generate as generateJS } from "./javascript/client-generator";
import { generate as generateTS } from "./typescript/client-generator";
import { generate as generateCS } from "./csharp/client-generator";

import { generate as generateServerJS } from "./javascript/server-generator";
import { generate as generateServerTS } from "./typescript/server-generator";

import type { ExtendedMetaInfo } from "./types";
import { createEnv } from "./env.utils";

export async function generateJSClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void> {
  const env = createEnv(false, "js");
  return generateJS({ meta, url: host, dirPath, nunjucks: env });
}

export async function generateTSClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void> {
  const env = createEnv(false, "ts");
  return generateTS({ meta, url: host, dirPath, nunjucks: env });
}

export async function generateCSharpClient(
  meta: ExtendedMetaInfo,
  dirPath: string,
  host: string
): Promise<void> {
  const env = createEnv(false, "cs");
  return generateCS({ meta, url: host, dirPath, nunjucks: env });
}

export async function generateJSServer(
  meta: ExtendedMetaInfo,
  dirPath: string
): Promise<void> {
  const env = createEnv(true, "js");
  return generateServerJS({ meta, dirPath, nunjucks: env });
}

export async function generateTSServer(
  meta: ExtendedMetaInfo,
  dirPath: string
): Promise<void> {
  const env = createEnv(true, "ts");
  return generateServerTS({ meta, dirPath, nunjucks: env });
}

main();

async function main() {
  const options = process.env.DONT_RUN_MAIN
    ? undefined
    : (yargs
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
        }).argv as any);

  if (!options) {
    return;
  }
  if (!options.filePath && !options.host) {
    console.log("You must provide either a host or a file path.");
    return;
  }

  const meta = (await (options.filePath
    ? readMetaFromFile(options.filePath)
    : fetchMeta(options.host))) as ExtendedMetaInfo;

  switch (options.language) {
    case "js":
      if (options.isServer) {
        generateJSServer(meta, options.outDir);
      } else {
        generateJSClient(meta, options.outDir, options.host);
      }
      break;
    case "ts":
      if (options.isServer) {
        generateTSServer(meta, options.outDir);
      } else {
        generateTSClient(meta, options.outDir, options.host);
      }
      break;
    case "cs":
      if (options.isServer) {
        throw new Error(
          "There is no support for generating CS server code yet!"
        );
      }
      generateCSharpClient(meta, options.outDir, options.host);
      break;
    default:
      break;
  }
}
