import type { Environment } from "nunjucks";
import type { MetaTypesRegistry, N1mblyInfo } from "../../../shared/types";
import { lowerFirstLetter, n1mblyConfigFrom } from "../../../shared/functions";
import {
  capitalizeFirstLetter,
  formatFileContent,
  pathExists,
  prepareDirectory,
  writeToFile,
} from "../utils/general";
import type { ExtendedMetaInfo, ExtendedServiceInfo } from "../types";
import { handleExistingCode } from "../utils/existing-code";

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
    `${dirPath}/index.js`,
    await indexFileContentFrom({
      nunjucks,
      info: meta.n1mblyInfo,
      services: meta.services,
      plugins: meta.plugins,
    })
  );

  await Promise.all([
    ...meta.services
      .filter((s) => !s.type || ["Controller", "RemoteProxy"].includes(s.type))
      .map(async (controller) => {
        const path = `${dirPath}/${controller.name}.js`;
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
        const path = `${dirPath}/${service.name}.js`;
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

async function controllerFileContentFrom({
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
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
    existingMethodsNotInMeta,
  });
  return formatFileContent(content);
}

async function serviceFileContentFrom({
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
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
    existingMethodsNotInMeta,
  });
  return formatFileContent(content);
}

function indexFileContentFrom({
  services,
  nunjucks,
  info,
  plugins,
}: {
  services: ExtendedServiceInfo[];
  info: N1mblyInfo;
  nunjucks: Environment;
  plugins: ExtendedMetaInfo["plugins"];
}): Promise<string> {
  const content = nunjucks.render("index.njk", {
    services: services.filter((service) => {
      return service.type == "RemoteProxy" || service.type == "LocalService";
    }),
    controllers: services.filter((service) => {
      return service.type == "Controller";
    }),
    info,
    plugins: plugins.map((plugin) => ({
      name: plugin.name
        .split("-")
        .map((x) => capitalizeFirstLetter(x))
        // replace all special characters with empty string
        .map((x) => x.replaceAll(/[^a-zA-Z0-9]/g, ""))
        .join(""),
      package: plugin.name,
      services: plugin.services,
    })),
  });
  return formatFileContent(content);
}
