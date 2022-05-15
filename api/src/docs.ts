import { ComplexType, RouteMetaInfo, ServiceMetaInfo } from "../../shared/types";
import { NimblyInfo } from "./nimbly-api";

export const generateDocsFrom = (
  meta: ServiceMetaInfo[],
  info: NimblyInfo
) => {
  const doc = {
    openapi: "3.0.0",
    info: {
      version: info?.version ?? "1.0.0",
      title: info?.name ?? "Nimbly API",
      description: info?.description ?? "",
    },
    servers: [
      { url: info.basePath }
    ],
    paths: {},
  };

  meta.forEach((service) => {
    service.routes.forEach((route) => {
      const path = getPathFrom(info, route);

      if (!doc.paths[path]) doc.paths[path] = {};

      doc.paths[path] = {
        ...doc.paths[path],
        [route.httpMethod.toLowerCase()]: getPathDocFrom(service, route),
      };
    });
  });

  return doc;
};

const getPathFrom = (info: NimblyInfo, r: RouteMetaInfo) => {
  let path = r.path.replace(info.basePath, '');
  r.pathParams.forEach((p) => (path = path.replace(`:${p}`, `{${p}}`)));
  return path;
}

const getPathDocFrom = (s: ServiceMetaInfo, r: RouteMetaInfo) => ({
    tags: [s.name],
    ...(getBodyDocFrom(r)),
    parameters: getParametersDocFrom(r),
    responses: getResponsesDocFrom(r),
});

const getParametersDocFrom = (r: RouteMetaInfo) => {
  return [
    ...getPathParametersDocFrom(r),
    ...getQueryParametersDocFrom(r),
  ];
};

const getPathParametersDocFrom = (r: RouteMetaInfo) => {
  return r.pathParams.map((p, i) => ({
    name: p,
    in: "path",
    schema: {
      type: r.pathParamTypes[i],
    },
    required: true,
  }));
};

const getQueryParametersDocFrom = (r: RouteMetaInfo) => {
  return r.queryParams.map((p, i) => ({
    name: p,
    in: "query",
    schema: {
      type: r.queryParamTypes[i],
    },
    required: true,
  }));
};

const getBodyDocFrom = (r: RouteMetaInfo) => ({
  ...(
    r.body ? {
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: getSchemaFrom(r.bodyType),
          },
        },
      }
    } : {}
  )
});

const getResponsesDocFrom = (r: RouteMetaInfo) => ({
  200: {
    headers: {},
    content: {
      "application/json": {
        schema: getSchemaFrom(r.returnType),
      },
    },
  },
});

const getSchemaFrom = (type: ComplexType) => {
  const objectSchema = { type: "object", properties: getPropertiesFrom(type) };
  return type?.$isArray ? { type: "array", items: objectSchema } : objectSchema;
}

const getPropertiesFrom = (type: ComplexType) => {
  const properties = {};
  Object.keys(type ?? {}).filter(key => key !== '$isArray').forEach(key => {
    properties[key] = typeof type[key] === "object" ? getSchemaFrom(type[key] as any) : { type: type[key] };
  });
  return properties;
}
