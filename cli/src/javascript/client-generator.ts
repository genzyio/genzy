import { n1mblyConfigFrom } from "../../../shared/functions";
import {
  MetaInfo,
  MetaTypesRegistry,
  ServiceMetaInfo,
} from "../../../shared/types";
import { formatFileContent, generate as generateUtil } from "../utils";

export function generate({
  meta,
  url,
  dirPath,
  nunjucks,
}: {
  meta: MetaInfo;
  url: string;
  dirPath: string;
  nunjucks: any;
}) {
  generateUtil(
    nunjucks,
    { meta, dirPath, url, extension: "js" },
    { controllerFileContentFrom, indexFileContentFrom }
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

function indexFileContentFrom({
  services,
  url,
  nunjucks,
}: {
  services: ServiceMetaInfo[];
  url: string | undefined;
  nunjucks: any;
}): Promise<string> {
  const content = nunjucks.render("index.njk", { services, url });
  return formatFileContent(content);
}
