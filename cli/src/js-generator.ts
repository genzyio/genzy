import { nimblyConfigFrom } from "../../shared/functions";
import { MetaTypesRegistry, ServiceMetaInfo } from "../../shared/types";
import { generate as generateUtil } from "./utils";

export function generate(
  meta: any,
  host: string | undefined,
  dirPath: string,
  nunjucks: any,
  isServer = false,
) {
  generateUtil(
    meta,
    host,
    dirPath,
    nunjucks,
    "js",
    fileContentFrom,
    indexFileContentFrom,
    typeFileContentFrom,
    "index",
    isServer,
  );
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  types: MetaTypesRegistry,
  nunjucks: any,
  host: string | undefined,
  isServer: boolean,
): string {
  return nunjucks.render("service.njk", {
    ...service,
    $nimbly: nimblyConfigFrom(service),
    isServer,
    types,
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string | undefined,
  nunjucks: any,
  isServer: boolean,
): string {
  return nunjucks.render("index.njk", { services, host, isServer });
}

export function typeFileContentFrom() {
}
