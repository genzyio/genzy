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
  isServer = false
) {
  generateUtil(
    meta,
    url,
    dirPath,
    nunjucks,
    "ts",
    fileContentFrom,
    indexFileContentFrom,
    "index",
    isServer
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  nunjucks: any,
  host: string | undefined,
  isServer: boolean
): string {
  const { schemas, schemaNames } = getSchemaInfoFrom(service, adoptTypeJS);
  return nunjucks.render("service.njk", {
    ...service,
    isServer,
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
        )
      ),
    ],
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string | undefined,
  nunjucks: any,
  isServer: boolean
): string {
  return nunjucks.render("index.njk", { services, host, isServer });
}
