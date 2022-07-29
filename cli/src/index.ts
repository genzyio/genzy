"use strict";
import * as yargs from 'yargs';
import * as nunjucks from 'nunjucks';
import { generate as generateJS } from './js-generator';
import { generate as generateTS } from './ts-generator';
import * as path from 'path'

const options = yargs
 .usage("Usage: -l <language> -h <host> -o")
 .option("l", { alias: "language", describe: "Target language", type: "string", demandOption: true, choices: ['js', 'ts'] })
 .option("h", { alias: "host", describe: "Target API URL (including the base path like '/api')", type: "string", demandOption: true })
 .option("o", { alias: "outDir", describe: "Output directory", type: "string", demandOption: true })
 .argv as any;

nunjucks.configure(path.resolve(__dirname, "./src/views-" + options.language), { autoescape: true });

switch (options.language) {
  case 'js':
    generateJS(options.host, options.outDir, nunjucks)
    break;
  case 'ts':
    generateTS(options.host, options.outDir, nunjucks)
    break;
  default:
    break;
}