import { type Project } from "../../features/projects/projects.models";
import { getPorts } from "../../features/watch-project/ports.manager";
import {
  type CompactMicroservice,
  type CompactService,
  type CompactController,
  type CompactRemoteProxy,
  type CompactPlugableService,
  type CompactFunction,
  type CompactFunctionParameter,
  type CompactClass,
  type CompactClassAttribute,
} from "./devtools.types";
import {
  type GenzyGeneratorInput,
  type GenzyPlugin,
  type GenzyInfo,
  type GenzyService,
  type GenzyAction,
  type GenzyEndpointParameter,
  type GenzyFunctionParameter,
  type GenzyType,
  type GenzyTypeAttributes,
} from "./genzy.types"; // TODO: Those types should probably be extracted from genzy lib

const primitiveTypes = ["any", "int", "float", "boolean", "string"];

type ProjectData = Record<string, CompactMicroservice>;

export function convertJSON(
  project: Project,
  microserviceId: string,
  microservicesData: ProjectData,
): GenzyGeneratorInput {
  const filteredMicroserviceData = Object.values(microservicesData)
    .filter((microserviceData) => microserviceData.type === "microservice")
    .reduce((microservicesData, microserviceData) => {
      microservicesData[microserviceData.id] = microserviceData;
      return microservicesData;
    }, {} as ProjectData);

  return _convertJSON(project, microserviceId, filteredMicroserviceData);
}

function _convertJSON(project: Project, microserviceId: string, microservicesData: ProjectData): GenzyGeneratorInput {
  const microserviceData = microservicesData[microserviceId];

  const outputJson: GenzyGeneratorInput = {
    services: createServices(project, microservicesData, microserviceData),
    types: {
      ...createTypesForRemoteServices(microservicesData, microserviceData),
      ...createTypes(microserviceData),
    },
    genzyInfo: createInfo(microserviceData),
    plugins: createPlugins(microserviceData),
  };

  return outputJson;
}

function createInfo(microserviceData: CompactMicroservice): GenzyInfo {
  const { name, description, version, basePath } = microserviceData;

  return {
    name,
    description,
    version,
    basePath,
  };
}

function createPlugins(microserviceData: CompactMicroservice): GenzyPlugin[] {
  return (
    microserviceData.plugins?.map((installedPlugin) => {
      const plugableServices = microserviceData.services
        .filter((service) => service.type === "PLUGABLE_SERVICE")
        .map((service) => service as CompactPlugableService)
        .filter((service) => service.plugin === installedPlugin.name)
        .map((service) => service.name);

      return {
        name: installedPlugin.name,
        services: plugableServices,
      };
    }) ?? []
  );
}

function createServices(
  project: Project,
  microservicesData: Record<string, CompactMicroservice>,
  microserviceData: CompactMicroservice,
): GenzyService[] {
  const { services, classes } = microserviceData;

  services
    .filter((service) => service.type === "REMOTE_PROXY")
    .map((service) => service as CompactRemoteProxy)
    .forEach((service) => {
      const remoteMicroservice = microservicesData[service.microserviceId];
      const realService = remoteMicroservice.services.find((realService) => realService.id === service.id);
      service.name = realService?.name ?? "";
    });

  return services
    .filter((service) => !["PLUGABLE_SERVICE"].includes(service.type))
    .map((service) => {
      const { name } = service;

      switch (service.type) {
        case "CONTROLLER":
          return {
            name,
            type: "Controller",
            dependencies: nameDependencies(services, service.dependencies),
            actions: createActions(classes, service.functions, "Controller"),
            path: service.basePath ?? "/",
          };

        case "LOCAL":
          return {
            name,
            type: "LocalService",
            dependencies: nameDependencies(services, service.dependencies),
            actions: createActions(classes, service.functions, "LocalService"),
          };

        case "API_INTEGRATION": {
          return {
            name,
            type: "RemoteProxy",
            actions: createActions(classes, service.functions, "Controller"),
            host: service.host,
            path: service.basePath ?? "/",
          };
        }
        default:
          return createRemoteProxyService(project, microservicesData[service.microserviceId], service.id);
      }
    });
}

function createRemoteProxyService(
  project: Project,
  remoteMicroserviceData: CompactMicroservice,
  serviceId: string,
): GenzyService {
  const { services, classes } = remoteMicroserviceData;
  const remoteService = services.find((service) => service.id === serviceId) as CompactController;

  const ports = getPorts(project);
  const port = ports[remoteMicroserviceData.id];

  return {
    name: remoteService.name,
    type: "RemoteProxy",
    actions: createActions(classes, remoteService.functions, "RemoteProxy"),
    path: remoteService.basePath ?? "/",
    host: `http://localhost:${port}/api`,
  };
}

function nameDependencies(services: CompactService[], dependencies: string[]): string[] {
  return dependencies.map((dependency) => {
    const service = services.find((service) => service.id === dependency);
    return service?.name ?? "";
  });
}

function createActions(classes: CompactClass[], functions: CompactFunction[], serviceType: string): GenzyAction[] {
  return functions.map((_function) => {
    const isController = serviceType !== "LocalService";
    const params = createParams(classes, _function.params, isController);
    const result = getTypeObject(classes, _function.returnType, undefined, _function.returnsCollection);

    if (serviceType === "LocalService") {
      return {
        name: _function.name,
        params,
        result,
      };
    }

    return {
      httpMethod: _function.method?.toLowerCase(),
      name: _function.name,
      path: _function.route,
      params,
      result,
    };
  });
}

function createParams(
  classes: CompactClass[],
  parameters: CompactFunctionParameter[],
  isController: boolean,
): GenzyFunctionParameter[] | GenzyEndpointParameter[] {
  return parameters.map((parameter) => {
    const { name, type, isCollection, isOptional, source } = parameter;

    if (isController) {
      return {
        name,
        type: getTypeObject(classes, type, isCollection, isOptional),
        source: source?.toLowerCase() ?? "",
      };
    }

    return { name, type: getTypeObject(classes, type, isCollection, isOptional) };
  });
}

function createTypesForRemoteServices(
  microservicesData: Record<string, CompactMicroservice>,
  microserviceData: CompactMicroservice,
): Record<string, GenzyType> {
  const remoteProxies = microserviceData.services
    .filter((service) => service.type === "REMOTE_PROXY")
    .map((services) => services as CompactRemoteProxy);

  return remoteProxies.reduce((acc: Record<string, GenzyType>, remoteProxy: CompactRemoteProxy) => {
    const remoteMicroservice = microservicesData[remoteProxy.microserviceId];
    const remoteService = remoteMicroservice.services.find(
      (service) => service.id === remoteProxy.id,
    ) as CompactController;

    const compexTypeIds = remoteService.functions.flatMap(extractComplexTypesFromFunction);
    const complexTypes = extractTypesInDepth(remoteMicroservice.classes, compexTypeIds);

    return {
      ...acc,
      ...complexTypes,
    };
  }, {});
}

function extractTypesInDepth(classes: CompactClass[], types: string[]): Record<string, GenzyType> {
  const typesToExtract = [...types];
  const extractedTypes: Record<string, GenzyType> = {};

  while (typesToExtract.length > 0) {
    const typeToExtract = typesToExtract.pop();
    const type = classes.find((_class) => _class.id === typeToExtract) as CompactClass;
    if (extractedTypes[type.name]) continue;

    extractedTypes[type.name] = createType(classes, type);
    typesToExtract.push(...extractComplexTypesFromClass(type));
  }

  return extractedTypes;
}

function extractComplexTypesFromFunction(_function: CompactFunction): string[] {
  const typesFromFunction = [_function.returnType, ..._function.params.map((param) => param.type)];

  return typesFromFunction.filter((type) => !primitiveTypes.includes(type));
}

function extractComplexTypesFromClass(_class: CompactClass): string[] {
  const attributeTypes = _class.attributes.map((attribute) => attribute.type);

  return attributeTypes.filter((type) => !primitiveTypes.includes(type));
}

function createTypes(microserviceData: CompactMicroservice): Record<string, GenzyType> {
  const classes = microserviceData.classes;

  return classes.reduce((types: Record<string, GenzyType>, _class: CompactClass) => {
    types[_class.name] = createType(classes, _class);
    return types;
  }, {});
}

function createType(classes: CompactClass[], _class: CompactClass): GenzyType {
  return _class.attributes.reduce((attributes: GenzyType, attribute: CompactClassAttribute) => {
    const { name, type, isOptional, isCollection } = attribute;
    attributes[name] = getTypeObject(classes, type, isOptional, isCollection);

    return attributes;
  }, {} as GenzyType);
}

function getTypeObject(
  classes: CompactClass[],
  type: string,
  isOptional: boolean | undefined,
  isArray: boolean | undefined,
): GenzyTypeAttributes {
  const primitive = isPrimitive(type);
  const typeKey = primitive ? "type" : "$typeName";
  const typeValue = primitive ? (type === "any" ? undefined : type) : getTypeName(classes, type);

  return {
    [typeKey]: typeValue,
    $isOptional: isOptional,
    $isArray: isArray,
  };
}

function getTypeName(classes: CompactClass[], type: string): string {
  return classes.find((_class) => _class.id === type)?.name ?? "";
}

function isPrimitive(type: string): boolean {
  return primitiveTypes.includes(type);
}
