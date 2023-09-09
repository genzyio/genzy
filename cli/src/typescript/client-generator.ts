import { MetaInfo, MetaTypesRegistry, ServiceMetaInfo } from "../../../shared/types";
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
  nunjucks: any;
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

function typesFileContentFrom({
  types,
  nunjucks,
}: {
  types: MetaTypesRegistry;
  nunjucks: any;
}): Promise<string> {
  const content = nunjucks.render("types.njk", { types });
  return formatFileContent(content);
}
