import axios from "axios";
import * as fs from "fs";
import { Param, ServiceMetaInfo } from "../../shared/types";

export function generate(
  url: string,
  dirPath: string,
  nunjucks: any,
  extension: "ts" | "js" | "cs",
  fileContentFrom: Function,
  indexFileContentFrom: Function,
  indexFileName: string = "index"
) {
  fetchMeta(url)
    .then((data) => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      data.forEach((service) => {
        fs.writeFileSync(
          dirPath + `/${service.name}.${extension}`,
          fileContentFrom(service, nunjucks, url)
        );
      });

      const indexContent = indexFileContentFrom(data, url, nunjucks);
      fs.writeFileSync(
        dirPath + `/${indexFileName}.${extension}`,
        indexContent
      );
    })
    .catch((err) => {
      console.log(err);
    });
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
  if (typeof type === "string")
    return type === "int" || type === "float" ? "number" : type;
  return type.$typeName + (type.$isArray ? "[]" : "");
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
