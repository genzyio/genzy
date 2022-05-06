import { RouteMetaInfo, ServiceMetaInfo } from "../../shared/types";
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
  return r.pathParams.map((p) => ({
    name: p,
    in: "path",
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
            schema: {
              type: "object",
            },
          },
        },
      }
    } : {}
  )
});

const getResponsesDocFrom = (_: RouteMetaInfo) => ({
  200: {
    description: "A paged array of pets",
    headers: {},
    content: {
      "application/json": {
        schema: {
          type: "object",
        },
      },
    },
  },
});
