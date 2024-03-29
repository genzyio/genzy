import type {
  BasicType,
  ComplexType,
  MetaTypesRegistry,
  GenzyConfig,
  GenzyPluginParams,
} from "@genzy.io/api";
import { GenzyPlugin } from "@genzy.io/api";
import { ZodSchema, z } from "zod";

export class Plugin extends GenzyPlugin {
  async beforeRouteRegister(
    pluginParams: GenzyPluginParams & {
      serviceKey: string;
      serviceInstance: any;
      genzyConfig: GenzyConfig;
    }
  ) {
    // for all actions for every type, define zod schema
    Object.keys(pluginParams.genzyConfig.actions).forEach((methodName) => {
      const methodParams = pluginParams.genzyConfig.actions[methodName].params;
      methodParams.forEach((param) => {
        if (!param.type) {
          return;
        }
        if ("type" in param.type) {
          const zodSchema = z.object({
            [param.name]: basicTypeToZodSchema(param.type),
          });
          addInterceptorsFor(
            pluginParams,
            pluginParams.serviceKey,
            methodName,
            param.source,
            zodSchema
          );
        } else {
          const complexTypeProps =
            pluginParams.genzyConfig.types[param.type.$typeName];
          if (!complexTypeProps) {
            return;
          }
          const zodSchema = complexTypeToZodSchema(
            { ...param.type, ...complexTypeProps } as ComplexType,
            pluginParams.genzyConfig.types
          );
          addInterceptorsFor(
            pluginParams,
            pluginParams.serviceKey,
            methodName,
            param.source,
            zodSchema
          );
        }
      });
    });
  }
}

function complexTypeToZodSchema(
  type: ComplexType,
  typesRegistry: MetaTypesRegistry
) {
  const complexTypeSchemaObject = {};
  Object.keys(type)
    .filter((propertyName) => !propertyName.startsWith("$"))
    .forEach((propertyName) => {
      const property = type[propertyName];
      if ("type" in property) {
        complexTypeSchemaObject[propertyName] = basicTypeToZodSchema(property);
      } else {
        complexTypeSchemaObject[propertyName] = complexTypeToZodSchema(
          {
            ...property,
            ...typesRegistry[property.$typeName],
          } as ComplexType,
          typesRegistry
        );
      }
    });
  let complexTypeSchema: ZodSchema = z.object(complexTypeSchemaObject);

  if (type.$isArray) {
    complexTypeSchema = complexTypeSchema.array();
  }
  if (type.$isOptional) {
    complexTypeSchema = complexTypeSchema.optional();
  }

  return complexTypeSchema;
}

function addInterceptorsFor(
  params: GenzyPluginParams,
  serviceName: string,
  methodName: string,
  source: "body" | "path" | "query",
  zodSchema: ZodSchema
) {
  params.genzyApi.intercept({
    [serviceName]: {
      [methodName]: (req, res, next) => {
        const value =
          source === "body"
            ? req.body
            : source === "path"
            ? req.params
            : req.query;

        const result = zodSchema.safeParse(value);
        if (result.success) {
          if (source === "path") {
            req.params = result.data;
          } else if (source === "query") {
            req.query = result.data;
          } else if (source === "body") {
            req.body = result.data;
          }
          next();
        } else {
          res.status(400).send(result);
        }
      },
    },
  });
}

function basicTypeToZodSchema(type: BasicType) {
  const getBasicTypeSchema = (basicTypeName: BasicType["type"]) => {
    switch (basicTypeName) {
      case "string": {
        return z.string();
      }
      case "boolean": {
        return z.coerce.boolean();
      }
      case "float":
      case "int": {
        return z.coerce.number();
      }
    }
  };

  let basicTypeSchema: ZodSchema = getBasicTypeSchema(type.type);

  if (type.$isArray) {
    basicTypeSchema = basicTypeSchema.array();
  }
  if (type.$isOptional) {
    basicTypeSchema = basicTypeSchema.optional();
  }

  return basicTypeSchema;
}
