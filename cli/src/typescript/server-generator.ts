import type { Environment } from "nunjucks";
import {
  MetaInfo,
  MetaTypesRegistry,
  ServiceMetaInfo,
} from "../../../shared/types";
import {
  adoptParams,
  adoptTypeJS,
  adoptTypeToResultDecorator,
  controllerToServiceName,
  formatFileContent,
  generate as generateUtil,
} from "../utils";

export function generate({
  meta,
  dirPath,
  nunjucks,
}: {
  meta: MetaInfo;
  dirPath: string;
  nunjucks: Environment;
}) {
  generateUtil(
    nunjucks,
    { meta, dirPath, extension: "ts" },
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

function controllerFileContentFrom({
  service,
  types,
  nunjucks,
}: {
  service: ServiceMetaInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("controller.njk", {
    ...service,
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

function serviceFileContentFrom({
  service,
  types,
  nunjucks,
}: {
  service: ServiceMetaInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    name: controllerToServiceName(service.name),
    controllerName: service.name,
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

function indexFileContentFrom({
  services,
  nunjucks,
}: {
  services: ServiceMetaInfo[];
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("index.njk", { services });
  return formatFileContent(content);
}

function typesFileContentFrom({
  types,
  nunjucks,
}: {
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("types.njk", { types });
  return formatFileContent(content);
}
