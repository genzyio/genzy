import { ServiceMetaInfo } from "../../shared/types";
import {
  adoptParams,
  adoptTypeJS,
  generate as generateUtil,
  getSchemaInfoFrom,
} from "./utils";

export function generate(
  meta: any,
  url: string,
  dirPath: string,
  nunjucks: any,
) {
  generateUtil(
    meta,
    url,
    dirPath,
    nunjucks,
    "ts",
    fileContentFrom,
    indexFileContentFrom,
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  nunjucks: any,
): string {
  const { schemas, schemaNames } = getSchemaInfoFrom(service, adoptTypeJS);
  return nunjucks.render("service.njk", {
    ...service,
    schemas,
    schemaNames,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeJS),
      result: adoptTypeJS(r.result),
    })),
    existingMethods: [
      ...new Set(
        service.actions.map((r) =>
          capitalizeFirstLetter(r.httpMethod.toLowerCase())
        ),
      ),
    ],
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string,
  nunjucks: any,
): string {
  return nunjucks.render("index.njk", { services, host });
}
