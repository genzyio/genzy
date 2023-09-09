import {
  MetaInfo,
  MetaTypesRegistry,
  ServiceMetaInfo,
} from "../../../shared/types";
import { adoptParams, adoptTypeCS, generate as generateUtil } from "../utils";

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
    { meta, url, dirPath, typesFileName: "Models", extension: "cs" },
    { controllerFileContentFrom, typesFileContentFrom }
  );
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function controllerFileContentFrom({
  service,
  types,
  nunjucks,
  url,
}: {
  service: ServiceMetaInfo;
  types: MetaTypesRegistry;
  nunjucks: any;
  url: string;
}): Promise<string> {
  return nunjucks.render("service.njk", {
    url,
    types,
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
        )
      ),
    ],
  });
}

function typesFileContentFrom({
  types,
  nunjucks,
}: {
  types: MetaTypesRegistry;
  nunjucks: any;
}): Promise<string> {
  const typesCopy = JSON.parse(JSON.stringify(types));
  Object.keys(typesCopy).forEach((type) => {
    Object.keys(typesCopy[type]).forEach((propName) => {
      if (typesCopy[type][propName].type) {
        typesCopy[type][propName].type = adoptTypeCS(
          typesCopy[type][propName].type
        );
      }
    });
  });
  return nunjucks.render("models.njk", { types: typesCopy });
}

function getNamespaceNameFrom(service: ServiceMetaInfo): string {
  return `N1mbly.services.${service.name}`;
}
