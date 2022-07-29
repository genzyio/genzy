import {
  ComplexType,
  Param,
  RouteMetaInfo,
  ServiceMetaInfo,
} from "../../shared/types";
import { NimblyInfo } from "./nimbly-api";

export const generateDocsFrom = (meta: ServiceMetaInfo[], info: NimblyInfo) => {
  const doc = {
    openapi: "3.0.0",
    info: {
      version: info?.version ?? "1.0.0",
      title: info?.name ?? "Nimbly API",
      description: info?.description ?? "",
    },
    servers: [{ url: info.basePath }],
    paths: {},
  };

  meta.forEach((service) => {
    service.actions.forEach((action) => {
      const path = getPathFrom(info, service, action);

      if (!doc.paths[path]) doc.paths[path] = {};

      doc.paths[path] = {
        ...doc.paths[path],
        [action.httpMethod.toLowerCase()]: getPathDocFrom(service, action),
      };
    });
  });

  return doc;
};

const getPathFrom = (info: NimblyInfo, s: ServiceMetaInfo, r: RouteMetaInfo) => {
  let path = r.path.replace(info.basePath, "");
  r.params
    .filter((p) => p.source === "path")
    .map((p) => p.name)
    .forEach((p) => (path = path.replace(`:${p}`, `{${p}}`)));
  return `${s.path}${path}`.replace('\/\/', '/');
};

const getPathDocFrom = (s: ServiceMetaInfo, r: RouteMetaInfo) => ({
  tags: [s.name],
  ...getBodyDocFrom(r),
  parameters: getParametersDocFrom(r),
  responses: getResponsesDocFrom(r),
});

const getParametersDocFrom = (r: RouteMetaInfo) => {
  return r.params
    .filter((p) => p.source !== "body")
    .map((p) => ({
      name: p.name,
      in: p.source,
      schema: {
        type: mapTypeToOpenAPIType(p.type as string),
      },
      required: true,
    }));
};

const getBodyDocFrom = (r: RouteMetaInfo) => {
  const bodyParam: Param = r.params.find((p) => p.source === "body");
  return {
    ...(!!bodyParam
      ? {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: getSchemaFrom(bodyParam.type as ComplexType),
              },
            },
          },
        }
      : {}),
  };
};

const getResponsesDocFrom = (r: RouteMetaInfo) => ({
  200: {
    headers: {},
    content: {
      "application/json": {
        schema: getSchemaFrom(r.result),
      },
    },
  },
});

const getSchemaFrom = (type: ComplexType) => {
  const objectSchema = { type: "object", properties: getPropertiesFrom(type) };
  return type?.$isArray ? { type: "array", items: objectSchema } : objectSchema;
};

const getPropertiesFrom = (type: ComplexType) => {
  return modifyPropertiesOf(type, (key: string, type: any) =>
    typeof type[key] === "object"
      ? getSchemaFrom(type[key] as any)
      : { type: mapTypeToOpenAPIType(type[key]) }
  );
};

const modifyPropertiesOf = (
  type: ComplexType,
  gen: (key: string, type: any) => any
) => {
  const properties = {};
  Object.keys(type ?? {})
    .filter((key) => !key.startsWith("$"))
    .forEach((key) => {
      properties[key] = gen(key, type);
    });
  return properties;
};

const mapTypeToOpenAPIType = (type: string) =>
  type === "int" || type === "float" ? "number" : type;
