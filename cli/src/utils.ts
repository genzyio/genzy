import axios from "axios";
import * as fs from "fs";
import { Param, ServiceMetaInfo } from "../../shared/types";

export function generate(
  url: string,
  dirPath: string,
  nunjucks: any,
  extension: "ts" | "js",
  fileContentFrom: Function,
  indexFileContentFrom: Function
) {
  fetchMeta(url)
    .then((data) => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      data.forEach((service) => {
        fs.writeFileSync(
          dirPath + `/${service.name}.${extension}`,
          fileContentFrom(service, nunjucks)
        );
      });

      const indexContent = indexFileContentFrom(data, url, nunjucks);
      fs.writeFileSync(dirPath + `/index.${extension}`, indexContent);
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function fetchMeta(url: string) {
  return (await axios.get(`${url}/meta`)).data;
}

export function adoptParams(params: Param[]) {
  return params.map((p) => ({
    ...p,
    type: adoptType(p.type)
  }));
}

export function adoptType(type) {
  if(!type) return "any";
  if(typeof type === "string")
    return (type === "int" || type === "float") ? "number" : type;
  return type.$typeName + (type.$isArray ? '[]' : '');
}

export function getSchemaInfoFrom(service: ServiceMetaInfo) {
  const schemas = [];
  const schemaNames = [];
  service.actions.forEach((action) => {
      action.params
        .filter((p) => typeof p.type !== "string")
        .forEach((p) => getAllSubtypesFrom(p.type, schemas, schemaNames));
      action.result && getAllSubtypesFrom(action.result, schemas, schemaNames)
    }
  );
  return {
    schemas: getSetFrom(schemas).map(schema => JSON.stringify(schema, (k, v) => k.startsWith('$') ? undefined : v, 2)),
    schemaNames: getSetFrom(schemaNames),
  };
}

export function getAllSubtypesFrom(
  schema: any,
  subtypes: any[],
  subtypeNames: string[]
) {
  if (!schema || typeof schema !== "object") return adoptType(schema);
  const result = {};
  Object.keys(schema)
    .filter((k) => !k.startsWith("$"))
    .forEach((k) => {
      result[k] = getAllSubtypesFrom(schema[k], subtypes, subtypeNames);
    });
  subtypes.push(result);
  subtypeNames.push(schema.$typeName);
  return adoptType(schema);
}

export function getSetFrom(list: any[]): any[] {
  return [...new Set(list)].filter((s) => !!s);
}
