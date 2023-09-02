import { MetaTypesRegistry, ServiceMetaInfo } from "../../shared/types";
import {
  adoptParams,
  adoptTypeJS,
  adoptTypeToResultDecorator,
  controllerToServiceName,
  formatFileContent,
  generate as generateUtil,
} from "./utils";

export function generate(
  meta: any,
  url: string,
  dirPath: string,
  nunjucks: any,
  isServer = false
) {
  generateUtil(
    nunjucks,
    { meta, url, dirPath, isServer, extension: "ts" },
    {
      controllerFileContentFrom,
      serviceFileContentFrom,
      indexFileContentFrom,
      typesFileContentFrom,
    }
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    isServer,
    types,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeJS),
      resultType: adoptTypeJS(r.result),
      resultDecorator: adoptTypeToResultDecorator(r.result),
    })),
    existingMethods: [
      ...new Set(
        service.actions.map((r) =>
          capitalizeFirstLetter(r.httpMethod.toLowerCase())
        )
      ),
    ],
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
    isServer,
    types,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeJS),
      resultType: adoptTypeJS(r.result),
    })),
    existingMethods: [
      ...new Set(
        service.actions.map((r) =>
          capitalizeFirstLetter(r.httpMethod.toLowerCase())
        )
      ),
    ],
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

function typesFileContentFrom(
  types: MetaTypesRegistry,
  nunjucks: any,
  isServer: boolean
): Promise<string> {
  const content = nunjucks.render("types.njk", { types, isServer });
  return formatFileContent(content);
}
