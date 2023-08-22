import axios from "axios";
import * as fs from "fs";
import {
  MetaInfo,
  MetaTypesRegistry,
  Param,
  ServiceMetaInfo,
} from "../../shared/types";
import { format } from "prettier";

export async function readMetaFromFile(filePath: string) {
  return new Promise((resolve) => {
    resolve(JSON.parse(fs.readFileSync(filePath, "utf8")));
  });
}

export function generate(
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
    isServer: boolean,
  ) => void,
  indexFileContentFrom: (
    services: ServiceMetaInfo[],
    host: string,
    nunjucks: any,
    isServer: boolean,
  ) => void,
  typesFileContentFrom: (
    types: MetaTypesRegistry,
    nunjucks: any,
  ) => void,
  indexFileName: string,
  isServer: boolean,
) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  meta.services.forEach((service) => {
    writeToFile(
      dirPath + `/${service.name}.${extension}`,
      fileContentFrom(service, meta.types, nunjucks, url, isServer),
    );
  });

  writeToFile(
    dirPath + `/${indexFileName}.${extension}`,
    indexFileContentFrom(meta.services, url, nunjucks, isServer),
  );
  writeToFile(
    dirPath + `/types.${extension}`,
    typesFileContentFrom(meta.types, nunjucks),
  );
}

export async function writeToFile(filePath: any, fileContent: any) {
  const formattedContent = await format(fileContent, {
    parser: "typescript",
  });

  fs.writeFileSync(filePath, formattedContent);
}

export async function fetchMeta(url: string) {
  return (await axios.get(`${url}/meta`)).data;
}

export function adoptParams(params: Param[], typeAdopt: (p: any) => string) {
  return params.map((p) => ({
    ...p,
    type: typeAdopt(p.type),
  }));
}

export function adoptTypeJS(type) {
  if (!type) return "any";
  if (typeof type === "string") {
    return type === "int" || type === "float" ? "number" : type;
  }
  return type.$typeName + (type.$isArray ? "[]" : "");
}

export function adoptTypeCS(type) {
  if (!type) return "object";
  if (typeof type === "string") return type;
  return type.$typeName + (type.$isArray ? "[]" : "");
}

export function getSchemaInfoFrom(
  service: ServiceMetaInfo,
  typeAdopt: (p: any) => string,
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
  typeAdopt: (p: any) => string,
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
        typeAdopt,
      );
    });
  subtypes.push(result);
  subtypeNames.push(schema.$typeName);
  return typeAdopt(schema);
}

export function getSetFrom(list: any[]): any[] {
  return [...new Set(list)].filter((s) => !!s);
}
