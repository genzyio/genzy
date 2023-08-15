import { nimblyConfigFrom } from "../../shared/functions";
import { ServiceMetaInfo } from "../../shared/types";
import { generate as generateUtil } from "./utils";

export function generate(
  meta: any,
  host: string | undefined,
  dirPath: string,
  nunjucks: any,
  isServer = false
) {
  generateUtil(
    meta,
    host,
    dirPath,
    nunjucks,
    "js",
    fileContentFrom,
    indexFileContentFrom,
    "index",
    isServer
  );
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  nunjucks: any,
  host: string | undefined,
  isServer: boolean
): string {
  return nunjucks.render("service.njk", {
    ...service,
    $nimbly: nimblyConfigFrom(service),
    isServer,
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string | undefined,
  nunjucks: any,
  isServer: boolean
): string {
  return nunjucks.render("index.njk", { services, host, isServer });
}
