import { n1mblyConfigFrom } from "../../shared/functions";
import { MetaTypesRegistry, ServiceMetaInfo } from "../../shared/types";
import { formatFileContent, generate as generateUtil } from "./utils";

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
    typeFileContentFrom,
    "index",
    isServer
  );
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  types: MetaTypesRegistry,
  nunjucks: any,
  host: string | undefined,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    $nimbly: { ...n1mblyConfigFrom(service), types },
    isServer,
    types,
  });
  return formatFileContent(content);
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string | undefined,
  nunjucks: any,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("index.njk", { services, host, isServer });
  return formatFileContent(content);
}

export async function typeFileContentFrom() {
  return "";
}
