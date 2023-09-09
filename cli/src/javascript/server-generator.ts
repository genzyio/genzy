import { n1mblyConfigFrom } from "../../../shared/functions";
import { MetaInfo, MetaTypesRegistry, ServiceMetaInfo } from "../../../shared/types";
import {
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
  nunjucks: any;
}) {
  generateUtil(
    nunjucks,
    { meta, dirPath, extension: "js" },
    { controllerFileContentFrom, indexFileContentFrom, serviceFileContentFrom }
  );
}

function controllerFileContentFrom({
  service,
  types,
  nunjucks,
}: {
  service: ServiceMetaInfo;
  types: MetaTypesRegistry;
  nunjucks: any;
}): Promise<string> {
  const content = nunjucks.render("controller.njk", {
    ...service,
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
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
  nunjucks: any;
}): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    name: controllerToServiceName(service.name),
    controllerName: service.name,
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
  });
  return formatFileContent(content);
}

function indexFileContentFrom({
  services,
  nunjucks,
}: {
  services: ServiceMetaInfo[];
  nunjucks: any;
}): Promise<string> {
  const content = nunjucks.render("index.njk", { services });
  return formatFileContent(content);
}
