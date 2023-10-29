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
