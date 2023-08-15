import { ServiceMetaInfo } from "../../shared/types";
import {
  adoptParams,
  adoptTypeCS,
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
    "cs",
    fileContentFrom,
    indexFileContentFrom,
    "Models",
    isServer
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fileContentFrom(
  service: ServiceMetaInfo,
  nunjucks: any,
  host: string,
  isServer: boolean
): string {
  return nunjucks.render("service.njk", {
    host,
    isServer,
    namespaceName: getNamespaceNameFrom(service),
    ...service,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeCS),
      result: adoptTypeCS(r.result),
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
  isServer: boolean
): string {
  const namespaces = [
    ...services.map((service) => {
      const { schemas, schemaNames } = getSchemaInfoFrom(service, adoptTypeCS);
      return {
        name: getNamespaceNameFrom(service),
        schemaNames,
        schemas: schemas.map((s) => {
          const parsedSchema = JSON.parse(s);
          return Object.keys(parsedSchema).map((propertyName) => {
            const propertyValue = parsedSchema[propertyName];
            const isList = propertyValue.endsWith("[]");
            return {
              name: propertyName,
              type: propertyValue.replace("[]", ""),
              isList,
            };
          });
        }),
      };
    }),
  ];
  return nunjucks.render("models.njk", {
    namespaces,
    services,
    host,
    isServer
  });
}

function getNamespaceNameFrom(service: ServiceMetaInfo): string {
  return `N1mbly.services.${service.name}`;
}
