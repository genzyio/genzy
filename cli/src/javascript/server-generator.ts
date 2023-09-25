import type { Environment } from "nunjucks";
import type { MetaTypesRegistry } from "../../../shared/types";
import { lowerFirstLetter, n1mblyConfigFrom } from "../../../shared/functions";
import {
  formatFileContent,
  pathExists,
  prepareDirectory,
  readFileSync,
  writeToFile,
} from "../utils";
import type { ExtendedMetaInfo, ExtendedServiceInfo } from "../types";
import { JSTSParser } from "../parser/js-ts";

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
      services: meta.services,
    })
  );

  await Promise.all([
    ...meta.services
      .filter((s) => !s.type || ["Controller", "RemoteProxy"].includes(s.type))
      .map(async (controller) => {
        const path = `${dirPath}/${controller.name}.js`;
        if (pathExists(path) && controller.type !== "RemoteProxy") {
          const methodBodyMap = getExistingMethodBodyMap(path, controller);
          controller.actions.forEach((action) => {
            // TODO handle type
            const existingAction = action as any;
            existingAction.existingBody = methodBodyMap.get(action.name);
          });
        }
        writeToFile(
          path,
          await controllerFileContentFrom({
            nunjucks,
            types: meta.types,
            service: controller,
          })
        );
      }),
    ...meta.services
      .filter((s) => ["LocalService"].includes(s.type))
      .map(async (service) => {
        const path = `${dirPath}/${service.name}.js`;
        if (pathExists(path)) {
          const methodBodyMap = getExistingMethodBodyMap(path, service);
          service.actions.forEach((action) => {
            // TODO handle type
            const existingAction = action as any;
            existingAction.existingBody = methodBodyMap.get(action.name);
          });
        }
        writeToFile(
          path,
          await serviceFileContentFrom({
            nunjucks,
            types: meta.types,
            service,
          })
        );
      }),
  ]);
}

function getExistingMethodBodyMap(
  path: string,
  controller: ExtendedServiceInfo
): Map<string, string> {
  const methodBodyMap = new Map<string, string>();
  if (pathExists(path)) {
    try {
      const classObj = JSTSParser.parse(readFileSync(path)).classes.find(
        (x) => x.name === controller.name
      );
      classObj.sections
        // TODO capture in-between sections, like comments as well
        .filter((section) => section.type === "method")
        .forEach((method) => {
          methodBodyMap.set(method.name, method.body);
        });
    } catch (error) {
      console.log("Parsing error: ", readFileSync(path), error);
    }
  }
  return methodBodyMap;
}

async function controllerFileContentFrom({
  service,
  types,
  nunjucks,
}: {
  service: ExtendedServiceInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("controller.njk", {
    ...service,
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
  });
  return formatFileContent(content);
}

async function serviceFileContentFrom({
  service,
  types,
  nunjucks,
}: {
  service: ExtendedServiceInfo;
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("service.njk", {
    ...service,
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency)
    ),
    $nimbly: { ...n1mblyConfigFrom(service), types },
    types,
  });
  return formatFileContent(content);
}

function indexFileContentFrom({
  services,
  nunjucks,
}: {
  services: ExtendedServiceInfo[];
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("index.njk", {
    services: services.filter((service) => {
      return service.type == "RemoteProxy" || service.type == "LocalService";
    }),
    controllers: services.filter((service) => {
      return service.type == "Controller";
    }),
  });
  return formatFileContent(content);
}
