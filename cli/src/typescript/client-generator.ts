import type { Environment } from "nunjucks";
import {
  MetaInfo,
  MetaTypesRegistry,
  ServiceMetaInfo,
} from "../../../shared/types";
import {
  adoptParams as adaptParams,
  adaptTypeJS,
  adoptTypeToResultDecorator as adaptTypeToResultDecorator,
  formatFileContent,
  generate as generateUtil,
} from "../utils/general";

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
    { meta, url, dirPath, extension: "ts" },
    {
      controllerFileContentFrom,
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
      params: adaptParams(r.params, adaptTypeJS),
      resultType: adaptTypeJS(r.result),
      resultDecorator: adaptTypeToResultDecorator(r.result),
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
