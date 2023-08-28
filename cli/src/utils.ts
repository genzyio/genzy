import axios from "axios";
import * as fs from "fs";
import { format } from "prettier";
import {
  MetaInfo,
  MetaTypesRegistry,
  Param,
  ServiceMetaInfo,
} from "../../shared/types";

export async function readMetaFromFile(filePath: string) {
  return new Promise((resolve) => {
    resolve(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });
}

export async function generate(
  meta: MetaInfo,
  url: string,
  dirPath: string,
  nunjucks: any,
  extension: "ts" | "js" | "cs",
  fileContentFrom: (
    service: ServiceMetaInfo,
    types: MetaTypesRegistry,
    nunjucks: any,
    host: string,
    isServer: boolean
  ) => Promise<string>,
  indexFileContentFrom: (
    services: ServiceMetaInfo[],
    host: string,
    nunjucks: any,
    isServer: boolean
  ) => Promise<string>,
  typesFileContentFrom: (
    types: MetaTypesRegistry,
    nunjucks: any,
    isServer: boolean
  ) => Promise<string>,
  indexFileName: string,
  isServer: boolean
) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  await Promise.all(
    meta.services.map(async (service) => {
      writeToFile(
        dirPath + `/${service.name}.${extension}`,
        await fileContentFrom(service, meta.types, nunjucks, url, isServer)
      );
    })
  );

  writeToFile(
    dirPath + `/${indexFileName}.${extension}`,
    await indexFileContentFrom(meta.services, url, nunjucks, isServer)
  );
  const typesContent = await typesFileContentFrom(
    meta.types,
    nunjucks,
    isServer
  );
  if (typesContent) {
    writeToFile(dirPath + `/types.${extension}`, typesContent);
  }
}

export function writeToFile(filePath: string, fileContent: string) {
  fs.writeFileSync(filePath, fileContent);
}

export async function formatFileContent(fileContent: string): Promise<string> {
  return await format(fileContent, {
    parser: "typescript",
    plugins: ["prettier-plugin-organize-imports"],
  });
}

export async function fetchMeta(url: string) {
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
    return `@${type}`;
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
  if (typeof type === "string") return type;
  return type.$typeName + (type.$isArray ? "[]" : "");
}

export function getSchemaInfoFrom(
  service: ServiceMetaInfo,
  typeAdopt: (p: any) => string
) {
  const schemas = [];
  const schemaNames = [];
  service.actions.forEach((action) => {
    action.params
      .filter((p) => typeof p.type !== "string")
      .forEach((p) =>
        getAllSubtypesFrom(p.type, schemas, schemaNames, typeAdopt)
      );
    action.result &&
      getAllSubtypesFrom(action.result, schemas, schemaNames, typeAdopt);
  });
  return {
    schemas: getSetFrom(schemas).map((schema) =>
      JSON.stringify(schema, (k, v) => (k.startsWith("$") ? undefined : v), 2)
    ),
    schemaNames: getSetFrom(schemaNames),
  };
}

export function getAllSubtypesFrom(
  schema: any,
  subtypes: any[],
  subtypeNames: string[],
  typeAdopt: (p: any) => string
) {
  if (!schema || typeof schema !== "object") return typeAdopt(schema);
  const result = {};
  Object.keys(schema)
    .filter((k) => !k.startsWith("$"))
    .forEach((k) => {
      result[k] = getAllSubtypesFrom(
        schema[k],
        subtypes,
        subtypeNames,
        typeAdopt
      );
    });
  subtypes.push(result);
  subtypeNames.push(schema.$typeName);
  return typeAdopt(schema);
}

export function getSetFrom(list: any[]): any[] {
  return [...new Set(list)].filter((s) => !!s);
}
