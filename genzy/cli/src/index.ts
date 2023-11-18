import * as yargs from "yargs";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import {
  type ExtendedMetaInfo,
  type MetaInfo,
  generateJSServer,
  generateJSClient,
  generateTSServer,
  generateTSClient,
  generateCSharpClient,
} from "@genzy.io/generator";
import { createProject, startGenzy } from "@genzy.io/devtools-api";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "generate",
    "generate code",
    (yargs) => {
      return yargs
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
        });
    },
    async (options) => {
      if (!options) {
        return;
      }
      if (!options.f && !options.h) {
        console.log("You must provide either a host or a file path.");
        return;
      }

      const meta = (await (options.f
        ? readMetaFromFile(options.f)
        : fetchMeta(options.h))) as ExtendedMetaInfo;

      switch (options.language) {
        case "js":
          if (options.isServer) {
            generateJSServer(meta, options.o);
          } else {
            generateJSClient(meta, options.o, options.h);
          }
          break;
        case "ts":
          if (options.isServer) {
            generateTSServer(meta, options.o);
          } else {
            generateTSClient(meta, options.o, options.h);
          }
          break;
        case "cs":
          if (options.isServer) {
            throw new Error("There is no support for generating CS server code yet!");
          }
          generateCSharpClient(meta, options.o, options.h);
          break;
        default:
          break;
      }
    }
  )
  .command(
    "dev",
    "start DevTools server",
    (yargs) => {
      return yargs.option("p", {
        alias: "port",
        describe: "Port to bint to",
        default: 3000,
      });
    },
    async (options) => {
      startGenzy(options.p);
    }
  )
  .command(
    "open [path]",
    "start DevTools server with the default project",
    (yargs) => {
      return yargs
        .positional("path", {
          describe: "path of the genzy project directory",
          default: ".",
        })
        .option("p", {
          alias: "port",
          describe: "Port to bint to",
          default: 3000,
        });
    },
    async (options) => {
      const absolutePath = getAbsolutePath(options.path);
      startGenzy(options.p, absolutePath);
    }
  )
  .command(
    "create [name] [path]",
    "create a genzy project on the given path",
    (yargs) => {
      return yargs
        .positional("name", {
          describe: "name of the genzy project",
          default: ".",
        })
        .positional("path", {
          describe: "path of the genzy project base directory",
          default: ".",
        });
    },
    async (options) => {
      const absolutePath = getAbsolutePath(options.path);
      createProject({ name: options.name, path: absolutePath });
    }
  )
  .demandCommand(1)
  .parse();

function getAbsolutePath(relativePath: string) {
  return path.resolve(relativePath).replace("/", path.sep).replace("\\", path.sep);
}

export async function fetchMeta(url: string): Promise<MetaInfo> {
  return (await axios.get(`${url}/meta`)).data;
}

export async function readMetaFromFile(filePath: string): Promise<MetaInfo> {
  return new Promise((resolve) => {
    resolve(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });
}
