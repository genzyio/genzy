import { n1mblyConfigFrom } from "../../shared/functions";
import { MetaTypesRegistry, ServiceMetaInfo } from "../../shared/types";
import {
  controllerToServiceName,
  formatFileContent,
  generate as generateUtil,
} from "./utils";

export function generate(
  meta: any,
  host: string | undefined,
  dirPath: string,
  nunjucks: any,
  isServer = false
) {
  generateUtil(
    nunjucks,
    { meta, dirPath, isServer, extension: "js" },
    { controllerFileContentFrom, indexFileContentFrom, serviceFileContentFrom }
  );
}

function controllerFileContentFrom(
  service: ServiceMetaInfo,
  types: MetaTypesRegistry,
  nunjucks: any,
  host: string | undefined,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("controller.njk", {
    ...service,
    $nimbly: { ...n1mblyConfigFrom(service), types },
    isServer,
    types,
  });
  return formatFileContent(content);
}

function serviceFileContentFrom(
  service: ServiceMetaInfo,
  types: MetaTypesRegistry,
  nunjucks: any,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    name: controllerToServiceName(service.name),
    controllerName: service.name,
    $nimbly: { ...n1mblyConfigFrom(service), types },
    isServer,
    types,
  });
  return formatFileContent(content);
}

function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string | undefined,
  nunjucks: any,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("index.njk", { services, host, isServer });
  return formatFileContent(content);
}
