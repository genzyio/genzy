import type { Environment } from "nunjucks";
import axios from "axios";
import * as fs from "fs";
import { format } from "prettier";
import type {
  MetaInfo,
  MetaTypesRegistry,
  Param,
  ServiceMetaInfo,
} from "../../shared/types";

export async function readMetaFromFile(filePath: string): Promise<MetaInfo> {
  return new Promise((resolve) => {
    resolve(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });
}

export async function generate(
  nunjucks: Environment,
  params: {
    meta: MetaInfo;
    url?: string;
    dirPath: string;
    indexFileName?: string;
    typesFileName?: string;
    extension: "ts" | "js" | "cs";
  },
  contentHandlers: {
    controllerFileContentFrom?: (params: {
      service: ServiceMetaInfo;
      types: MetaTypesRegistry;
      nunjucks: Environment;
      url: string;
    }) => Promise<string>;
    serviceFileContentFrom?: (params: {
      service: ServiceMetaInfo;
      types: MetaTypesRegistry;
      nunjucks: Environment;
    }) => Promise<string>;
    indexFileContentFrom?: (params: {
      services: ServiceMetaInfo[];
      url: string;
      nunjucks: Environment;
    }) => Promise<string>;
    typesFileContentFrom?: (params: {
      types: MetaTypesRegistry;
      nunjucks: Environment;
    }) => Promise<string>;
  }
) {
  const {
    dirPath,
    meta,
    indexFileName = "index",
    typesFileName = "types",
    extension,
    url,
  } = params;
  prepareDirectory(dirPath);
  await Promise.all(
    meta.services.map(async (service) => {
      if (contentHandlers.controllerFileContentFrom) {
        writeToFile(
          dirPath + `/${service.name}.${extension}`,
          await contentHandlers.controllerFileContentFrom({
            service,
            types: meta.types,
            nunjucks,
            url,
          })
        );
      }
      if (contentHandlers.serviceFileContentFrom) {
        writeToFile(
          dirPath + `/${controllerToServiceName(service.name)}.${extension}`,
          await contentHandlers.serviceFileContentFrom({
            service,
            types: meta.types,
            nunjucks,
          })
        );
      }
    })
  );

  if (contentHandlers.indexFileContentFrom) {
    writeToFile(
      dirPath + `/${indexFileName}.${extension}`,
      await contentHandlers.indexFileContentFrom({
        services: meta.services,
        url,
        nunjucks,
      })
    );
  }
  if (contentHandlers.typesFileContentFrom) {
    const typesContent = await contentHandlers.typesFileContentFrom({
      types: meta.types,
      nunjucks,
    });
    writeToFile(dirPath + `/${typesFileName}.${extension}`, typesContent);
  }
}

export function pathExists(dirPath: string) {
  return fs.existsSync(dirPath);
}

export function prepareDirectory(dirPath: string) {
  if (!pathExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeToFile(filePath: string, fileContent: string) {
  fs.writeFileSync(filePath, fileContent);
}

export function readFileSync(filePath: string) {
  return fs.readFileSync(filePath).toString();
}

export async function formatFileContent(fileContent: string): Promise<string> {
  return await format(fileContent, {
    parser: "typescript",
    // TODO: fix prettier-plugin-organize-imports quirk
    plugins: process.env.DONT_RUN_MAIN
      ? undefined
      : ["prettier-plugin-organize-imports"],
  });
}

export async function fetchMeta(url: string): Promise<MetaInfo> {
  return (await axios.get(`${url}/meta`)).data;
}

export function adoptParams(params: Param[], typeAdopt: (p: any) => string) {
  return params.map((p) => ({
    ...p,
    type: typeAdopt(p.type),
    typeDecorator: adoptTypeToDecorator(p.type),
  }));
}

export function adoptTypeJS(type) {
  if (!type) return "any";
  if (typeof type === "string") {
    return type === "int" || type === "float" ? "number" : type;
  }
  return type.$typeName + (type.$isArray ? "[]" : "");
}

export function adoptTypeToDecorator(type) {
  if (!type) return undefined;
  if (typeof type === "string") {
    return `@${type}()`;
  }
  return type.$isArray
    ? `@arrayOf(${type.$typeName})`
    : `@type(${type.$typeName})`;
}

export function adoptTypeToResultDecorator(type) {
  if (!type) return undefined;
  return type.$isArray
    ? `@ReturnsArrayOf(${type.$typeName})`
    : `@Returns(${type.$typeName})`;
}

export function adoptTypeCS(type) {
  if (!type) return "object";
  if (typeof type === "string") {
    return type === "boolean" ? "bool" : type;
  }
  return type.$typeName;
}

export function controllerToServiceName(controllerName: string): string {
  const name = controllerName.replace("Controller", "Service");
  return `${name}${name.endsWith("Service") ? "" : "Service"}`;
}
