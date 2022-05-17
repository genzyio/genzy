import { ServiceMetaInfo } from "../../shared/types";
import { generate as generateUtil, getAllSubtypesFrom, getParametersFor, getSetFrom } from "./utils";

export function generate(url: string, dirPath: string, nunjucks: any) {
  generateUtil(url, dirPath, nunjucks, 'ts', fileContentFrom, indexFileContentFrom);
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileContentFrom(service: ServiceMetaInfo, nunjucks: any): string {
  const schemas = [];
  const schemaNames = [];
  service.schemas.forEach(schema => getAllSubtypesFrom(schema, schemas, schemaNames));
  return nunjucks.render('service.njk', {
    ...service,
    schemas: getSetFrom(schemas).map(schema => JSON.stringify(schema, (k, v) => k.startsWith('$') ? undefined : v, 2)),
    schemaNames: getSetFrom(schemaNames),
    routes: service.routes.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      parameters: getParametersFor(r)
    })),
    existingMethods: [...new Set(service.routes.map((r) => capitalizeFirstLetter(r.httpMethod.toLowerCase())))]
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string,
  nunjucks: any
): string {
  return nunjucks.render('index.njk', { services, host });
}
