import type {
  BasicType,
  ComplexType,
  ComplexTypeReference,
  MetaInfo,
  N1mblyInfo,
  Param,
  RouteMetaInfo,
  ServiceMetaInfo,
} from "../../shared/types";

export const generateDocsFrom = (meta: MetaInfo, info: N1mblyInfo) => {
  const doc = {
    openapi: "3.0.0",
    info: {
      version: info?.version ?? "1.0.0",
      title: info?.name ?? "Nimbly API",
      description: info?.description ?? "",
    },
    servers: [{ url: info.basePath }],
    paths: {},
    components: {
      schemas: {},
    },
  };

  meta.services.forEach((service) => {
    service.actions.forEach((action) => {
      const path = getPathFrom(info, service, action);

      if (!doc.paths[path]) doc.paths[path] = {};

      doc.paths[path] = {
        ...doc.paths[path],
        [action.httpMethod.toLowerCase()]: getPathDocFrom(service, action),
      };
    });
  });

  Object.keys(meta.types).forEach((typeName) => {
    doc.components.schemas[typeName] = getSchemaFrom(
      meta.types[typeName] as ComplexType
    );
  });

  return doc;
};

const getPathFrom = (
  info: N1mblyInfo,
  serviceMetaInfo: ServiceMetaInfo,
  routeMetaInfo: RouteMetaInfo
) => {
  let path = routeMetaInfo.path.replace(info.basePath, "");
  routeMetaInfo.params
    .filter((p) => p.source === "path")
    .map((p) => p.name)
    .forEach((p) => (path = path.replace(`:${p}`, `{${p}}`)));
  return `${serviceMetaInfo.path}${path}`.replace("//", "/");
};

const getPathDocFrom = (s: ServiceMetaInfo, r: RouteMetaInfo) => ({
  tags: [s.name],
  ...getBodyDocFrom(r),
  parameters: getParametersDocFrom(r),
  responses: getResponsesDocFrom(r),
});

const getParametersDocFrom = (routeMetaInfo: RouteMetaInfo) => {
  return routeMetaInfo.params
    .filter((p) => p.source !== "body")
    .map((p) => {
      if (p.type && "type" in p.type) {
        return {
          name: p.name,
          in: p.source,
          schema: p.type.$isArray
            ? {
                type: "array",
                items: {
                  type: mapTypeToOpenAPIType(p.type.type),
                },
              }
            : {
                type: mapTypeToOpenAPIType(p.type.type),
              },
          required: !p.type.$isOptional,
        };
      }
    });
};

const getBodyDocFrom = (routeMetaInfo: RouteMetaInfo) => {
  const bodyParam: Param = routeMetaInfo.params.find(
    (p) => p.source === "body"
  );
  return {
    ...(!!bodyParam
      ? {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: bodyParam.type
                  ? getSchemaRefFrom(bodyParam.type as ComplexTypeReference)
                  : {},
              },
            },
          },
        }
      : {}),
  };
};

const getResponsesDocFrom = (routeMetaInfo: RouteMetaInfo) => {
  if (!routeMetaInfo.result)
    return {
      200: {
        headers: {},
        content: {
          "application/json": {
            schema: {},
          },
        },
      },
    };
  if ("type" in routeMetaInfo.result) {
    const type = routeMetaInfo.result as BasicType;
    if (routeMetaInfo.path.includes("/pera-jaje")) {
      console.log(routeMetaInfo, mapTypeToOpenAPIType(type.type));
    }
    return {
      200: {
        headers: {},
        content: {
          "application/json": {
            schema: type.$isArray
              ? {
                  type: "array",
                  items: {
                    type: mapTypeToOpenAPIType(type.type),
                  },
                }
              : {
                  type: mapTypeToOpenAPIType(type.type),
                },
          },
        },
      },
    };
  }
  return {
    200: {
      headers: {},
      content: {
        "application/json": {
          schema: routeMetaInfo.result
            ? getSchemaRefFrom(routeMetaInfo.result)
            : {},
        },
      },
    },
  };
};

const getSchemaRefFrom = (type: ComplexTypeReference) => {
  const objectSchema = { $ref: `#/components/schemas/${type.$typeName}` };
  return type?.$isArray ? { type: "array", items: objectSchema } : objectSchema;
};

const getSchemaFrom = (type: ComplexType) => {
  const { properties, required } = getPropertiesFrom(type);
  const objectSchema = {
    required,
    type: "object",
    properties,
  };
  return type?.$isArray ? { type: "array", items: objectSchema } : objectSchema;
};

const getPropertiesFrom = (type: ComplexType) => {
  return modifyPropertiesOf(type, (key: string, type: any) => {
    if (type[key].$typeName) {
      return getSchemaRefFrom(type[key]);
    }
    return typeof type[key].type === "object"
      ? getSchemaFrom(type[key].type as any)
      : type[key].$isArray
      ? { type: "array", items: { type: mapTypeToOpenAPIType(type[key].type) } }
      : { type: mapTypeToOpenAPIType(type[key].type) };
  });
};

const modifyPropertiesOf = (
  type: ComplexType,
  gen: (key: string, type: any) => any
) => {
  const properties = {};
  const required = [];
  Object.keys(type ?? {})
    .filter((key) => !key.startsWith("$"))
    .forEach((key) => {
      properties[key] = gen(key, type);
      if (type[key].$isOptional === false) {
        required.push(key);
      }
    });
  return { properties, required };
};

const mapTypeToOpenAPIType = (type: string) =>
  type === "int" || type === "float" ? "number" : type;
