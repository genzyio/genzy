import type { Environment } from "nunjucks";
import type {
  ComplexTypeProperties,
  ComplexTypeReference,
  MetaTypesRegistry,
  N1mblyInfo,
} from "../../../shared/types";
import type { ExtendedMetaInfo, ExtendedServiceInfo } from "../types";
import {
  adoptParams,
  adoptTypeJS,
  adoptTypeToResultDecorator,
  formatFileContent,
  pathExists,
  prepareDirectory,
  readFileSync,
  sortedTypes,
  writeToFile,
} from "../utils";
import { JSTSParser } from "../parser/js-ts";
import { lowerFirstLetter } from "../../../shared/functions";

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
    }),
  );
  //
  // writeToFile(
  //   `${dirPath}/types.ts`,
  //   await typesFileContentFrom({
  //     nunjucks,
  //     types: meta.types,
  //   }),
  // );
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
        }),
      );
    }),
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
          }),
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
          }),
        );
      }),
  ]);
}

function getExistingMethodBodyMap(
  path: string,
  controller: ExtendedServiceInfo,
): Map<string, string> {
  const methodBodyMap = new Map<string, string>();
  if (pathExists(path)) {
    try {
      const classObj = JSTSParser.parse(readFileSync(path)).classes.find(
        (x) => x.name === controller.name,
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
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency),
    ),
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
    dependencies: service.dependencies?.map((dependency) =>
      lowerFirstLetter(dependency),
    ),
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
  info,
  nunjucks,
}: {
  services: ExtendedServiceInfo[];
  info: N1mblyInfo;
  nunjucks: Environment;
}): Promise<string> {
  const content = nunjucks.render("index.njk", {
    services: services.filter((service) => {
      return service.type == "RemoteProxy" || service.type == "LocalService";
    }),
    controllers: services.filter((service) => {
      return service.type == "Controller";
    }),
    info,
  });
  return formatFileContent(content);
}

function typesFileContentFrom({
  types,
  nunjucks,
}: {
  types: MetaTypesRegistry;
  nunjucks: Environment;
}): Promise<string> {
  //TODO: sort classes by dependecy
  const content = nunjucks.render("types.njk", { types });
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
