import axios from "axios";
import * as fs from "fs";
import { RouteMetaInfo } from "../../shared/types";

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
  return (await axios.get(`${url}/api/meta`)).data;
}

export function getParametersFor(route: RouteMetaInfo): any[] {
  const params = getAllParamNamesFrom(route);
  const types = getAllTypeNamesFrom(route);
  return params.map((param, i) => ({
    name: param,
    type: types[i],
    isQuery: !!route.queryParamDefinitions.find(({ index }) => index === i),
  }));
}

function getAllParamNamesFrom(route: RouteMetaInfo): any[] {
  const params = [...route.pathParams] ?? [];
  route.queryParamDefinitions
    ?.sort((a, b) => a.index - b.index)
    .forEach(({ index, name }) => params.splice(index, 0, name));
  route.body && params.push("body");
  return params;
}

function getAllTypeNamesFrom(route: RouteMetaInfo): any[] {
  return [
    ...(route.pathParams.length ? (route.pathParamTypes.length ? route.pathParamTypes : ["any"]) : []),
    ...(route.queryParams.length ? (route.queryParamTypes.length ? route.queryParamTypes : ["any"]) : []),
    ...(route.bodyType
      ? [route.bodyType.$typeName + (route.bodyType.$isArray ? "[]" : "")]
      : ["any"]),
  ];
}

export function getAllSubtypesFrom(schema: any, subtypes: any[], subtypeNames: string[]) {
  if(typeof schema !== 'object')
    return schema;
  const result = {};
  Object.keys(schema).filter(k => !k.startsWith('$')).forEach(k => {
    result[k] = getAllSubtypesFrom(schema[k], subtypes, subtypeNames);
  });
  subtypes.push(result);
  subtypeNames.push(schema.$typeName);
  return schema.$isArray ? `${schema.$typeName}[]` : schema.$typeName;
}

export function getSetFrom(list: any[]): any[] {
  return [...new Set(list)].filter(s => !!s);
}