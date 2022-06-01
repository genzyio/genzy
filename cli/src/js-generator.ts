import { nimblyConfigFrom } from "../../shared/functions";
import { ServiceMetaInfo } from "../../shared/types";
import { generate as generateUtil } from "./utils";

export function generate(url: string, dirPath: string, nunjucks: any) {
  generateUtil(url, dirPath, nunjucks, 'js', fileContentFrom, indexFileContentFrom);
}


export function fileContentFrom(service: ServiceMetaInfo, nunjucks: any): string {
  return nunjucks.render('service.njk', {...service, $nimbly: nimblyConfigFrom(service) });
}

export function indexFileContentFrom(services: ServiceMetaInfo[], host: string, nunjucks: any): string {
  return nunjucks.render('index.njk', {services, host});
}