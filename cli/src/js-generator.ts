import { nimblyConfigFrom } from "../../shared/functions";
import { ServiceMetaInfo } from "../../shared/types";
import { fetchMeta, generate as generateUtil } from "./utils";

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
    "js",
    fileContentFrom,
    indexFileContentFrom,
  );
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  nunjucks: any,
): string {
  return nunjucks.render("service.njk", {
    ...service,
    $nimbly: nimblyConfigFrom(service),
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string,
  nunjucks: any,
): string {
  return nunjucks.render("index.njk", { services, host });
}
