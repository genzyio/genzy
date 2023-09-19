import type { Environment } from "nunjucks";
import type { MetaTypesRegistry } from "../../../shared/types";
import type { ExtendedMetaInfo, ExtendedServiceInfo } from "../types";
import {
  adoptParams,
  adoptTypeJS,
  adoptTypeToResultDecorator,
  formatFileContent,
  pathExists,
  prepareDirectory,
  readFileSync,
  writeToFile,
} from "../utils";
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
    `${dirPath}/index.ts`,
    await indexFileContentFrom({
      nunjucks,
      services: meta.services,
    })
  );

  writeToFile(
    `${dirPath}/types.ts`,
    await typesFileContentFrom({
      nunjucks,
      types: meta.types,
    })
  );

  await Promise.all([
    ...meta.services
      .filter((s) => !s.type || ["Controller", "RemoteProxy"].includes(s.type))
      .map(async (controller) => {
        const path = `${dirPath}/${controller.name}.ts`;
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
        const path = `${dirPath}/${service.name}.ts`;
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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function controllerFileContentFrom({
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
    types,
    actions: service.actions.map((r) => ({
      ...r,
      httpMethod: capitalizeFirstLetter(r.httpMethod.toLowerCase()),
      params: adoptParams(r.params, adoptTypeJS),
      resultType: adoptTypeJS(r.result),
      resultDecorator: adoptTypeToResultDecorator(r.result),
    })),
  });
  return formatFileContent(content);
}

function serviceFileContentFrom({
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
    types,
    actions: service.actions.map((r) => ({
      ...r,
      params: adoptParams(r.params, adoptTypeJS),
      resultType: adoptTypeJS(r.result),
    })),
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
  const content = nunjucks.render("index.njk", { services });
  return formatFileContent(content);
}

function typesFileContentFrom({
  types,
  nunjucks,
}: {
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("types.njk", { types });
  return formatFileContent(content);
}
