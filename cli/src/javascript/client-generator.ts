import type { Environment } from "nunjucks";
import { n1mblyConfigFrom } from "../../../shared/functions";
import type {
  MetaInfo,
  MetaTypesRegistry,
  ServiceMetaInfo,
} from "../../../shared/types";
import { formatFileContent, generate as generateUtil } from "../utils/general";

export function generate({
  meta,
  url,
  dirPath,
  nunjucks,
}: {
  meta: MetaInfo;
  url: string;
  dirPath: string;
  nunjucks: Environment;
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
  nunjucks: Environment;
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
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("index.njk", { services, url });
  return formatFileContent(content);
}
