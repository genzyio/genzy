import { ServiceMetaInfo } from "../../shared/types";
import { adoptParams, adoptTypeCS, generate as generateUtil, getSchemaInfoFrom } from "./utils";

export function generate(url: string, dirPath: string, nunjucks: any) {
  generateUtil(url, dirPath, nunjucks, 'cs', fileContentFrom, indexFileContentFrom);
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileContentFrom(service: ServiceMetaInfo, nunjucks: any): string {
  const { schemas, schemaNames } = getSchemaInfoFrom(service, adoptTypeCS);
  return nunjucks.render('service.njk', {
    ...service,
    schemas: schemas.map(s => {
      const parsedSchema = JSON.parse(s);
      return Object.keys(parsedSchema).map(propertyName => {
        const propertyValue = parsedSchema[propertyName];
        const isList = propertyValue.endsWith('[]');
        return {
          name: propertyName,
          type: propertyValue,
          isList
        }
      });
    }),
    schemaNames,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeCS),
      result: adoptTypeCS(r.result)
    })),
    existingMethods: [...new Set(service.actions.map((r) => capitalizeFirstLetter(r.httpMethod.toLowerCase())))]
  });
}

export function indexFileContentFrom(
  services: ServiceMetaInfo[],
  host: string,
  nunjucks: any
): string {
  return nunjucks.render('index.njk', { services, host });
}
