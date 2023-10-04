import type { Environment } from "nunjucks";
import type {
  ComplexTypeProperties,
  MetaTypesRegistry,
  N1mblyInfo,
} from "../../../shared/types";
import type { ExtendedMetaInfo, ExtendedServiceInfo } from "../types";
import {
  adoptParams,
  adaptTypeJS,
  adoptTypeToResultDecorator,
  formatFileContent,
  pathExists,
  prepareDirectory,
  writeToFile,
} from "../utils/general";
import { lowerFirstLetter } from "../../../shared/functions";
import { handleExistingCode } from "../utils/existing-code";
import { sortedTypes } from "../utils/deps-sorting";

export async function generate({
  meta,
  dirPath,
  nunjucks,
}: {
  meta: ExtendedMetaInfo;
  dirPath: string;
  nunjucks: Environment;
}) {
  prepareDirectory(dirPath);

  writeToFile(
    `${dirPath}/index.ts`,
    await indexFileContentFrom({
      nunjucks,
      services: meta.services,
      info: meta.n1mblyInfo,
    })
  );
  const { sorted, dependencies } = sortedTypes(meta.types);
  const typesPath = dirPath + "/types";
  prepareDirectory(typesPath);
  await Promise.all(
    sorted.map(async (type: string) => {
      writeToFile(
        `${typesPath}/${type}.ts`,
        await typeFileContentFrom({
          name: type,
          type: meta.types[type],
          dependencies: dependencies[type],
          nunjucks,
        })
      );
    })
  );
  await Promise.all([
    ...meta.services
      .filter((s) => !s.type || ["Controller", "RemoteProxy"].includes(s.type))
      .map(async (controller) => {
        const path = `${dirPath}/${controller.name}.ts`;
        const existingMethodsNotInMeta: string[] = [];
        if (pathExists(path) && controller.type !== "RemoteProxy") {
          handleExistingCode(path, controller, existingMethodsNotInMeta);
        }
        writeToFile(
          path,
          await controllerFileContentFrom({
            nunjucks,
            types: meta.types,
            service: controller,
            existingMethodsNotInMeta,
          })
        );
      }),
    ...meta.services
      .filter((s) => ["LocalService"].includes(s.type))
      .map(async (service) => {
        const path = `${dirPath}/${service.name}.ts`;
        const existingMethodsNotInMeta: string[] = [];
        if (pathExists(path)) {
          handleExistingCode(path, service, existingMethodsNotInMeta);
        }
        writeToFile(
          path,
          await serviceFileContentFrom({
            nunjucks,
            types: meta.types,
            service,
            existingMethodsNotInMeta,
          })
        );
      }),
  ]);
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function controllerFileContentFrom({
  service,
  types,
  nunjucks,
  existingMethodsNotInMeta,
}: {
  service: ExtendedServiceInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
  existingMethodsNotInMeta: string[];
}): Promise<string> {
  const content = nunjucks.render("controller.njk", {
    ...service,
    types,
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adaptTypeJS),
      resultType: adaptTypeJS(r.result),
      resultDecorator: adoptTypeToResultDecorator(r.result),
    })),
    existingMethodsNotInMeta,
  });
  return formatFileContent(content);
}

function serviceFileContentFrom({
  service,
  types,
  nunjucks,
  existingMethodsNotInMeta,
}: {
  service: ExtendedServiceInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
  existingMethodsNotInMeta: string[];
}): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    types,
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    actions: service.actions.map((r) => ({
      ...r,
      params: adoptParams(r.params, adaptTypeJS),
      resultType: adaptTypeJS(r.result),
    })),
    existingMethodsNotInMeta,
  });
  return formatFileContent(content);
}

function indexFileContentFrom({
  services,
  info,
  nunjucks,
}: {
  services: ExtendedServiceInfo[];
  info: N1mblyInfo;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("index.njk", {
    services: services.filter((service) => {
      return service.type === "RemoteProxy" || service.type === "LocalService";
    }),
    controllers: services.filter((service) => {
      return !service.type || service.type === "Controller";
    }),
    info,
  });
  return formatFileContent(content);
}

function typeFileContentFrom({
  name,
  type,
  dependencies,
  nunjucks,
}: {
  name: string;
  type: ComplexTypeProperties;
  dependencies: string[];
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("type.njk", { name, type, dependencies });
  return formatFileContent(content);
}
