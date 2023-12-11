import { type Project } from "../../projects/projects.models";
import {
  type ProjectDefinitionData,
  type Microservice,
  type Service,
  type Controller,
  type RemoteProxy,
  type PlugableService,
  type Function,
  type FunctionParameter,
  type Class,
  type ClassAttribute,
} from "../project-definition.models";
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
} from "./genzy.types";
import { getPorts } from "../../watch-project/ports.manager";

const primitiveTypes = ["any", "int", "float", "boolean", "string"];

export function convertProjectDefinition(
  project: Project,
  microserviceId: string,
  projectData: ProjectDefinitionData,
): GenzyGeneratorInput {
  const filteredProjectData = Object.values(projectData)
    .filter((microservice) => microservice.type === "microservice")
    .reduce((microservices, microservice) => {
      microservices[microservice.id] = microservice;
      return microservices;
    }, {} as ProjectDefinitionData);

  return _convertJSON(project, filteredProjectData[microserviceId], filteredProjectData);
}

function _convertJSON(
  project: Project,
  microservice: Microservice,
  projectData: ProjectDefinitionData,
): GenzyGeneratorInput {
  return {
    services: createServices(project, projectData, microservice),
    types: {
      ...createTypesForRemoteServices(projectData, microservice),
      ...createTypes(microservice),
    },
    genzyInfo: createInfo(microservice),
    plugins: createPlugins(microservice),
  };
}

function createInfo(microservice: Microservice): GenzyInfo {
  const { name, description, version, basePath } = microservice;

  return {
    name,
    description,
    version,
    basePath,
  };
}

function createPlugins(microservice: Microservice): GenzyPlugin[] {
  return (
    microservice.plugins?.map((plugin) => {
      const plugableServices = microservice.services
        .filter((service) => service.type === "PLUGABLE_SERVICE")
        .map((service) => service as PlugableService)
        .filter((service) => service.plugin === plugin.name)
        .map((service) => service.name);

      return {
        name: plugin.name,
        services: plugableServices,
      };
    }) ?? []
  );
}

function createServices(
  project: Project,
  projectData: ProjectDefinitionData,
  microservice: Microservice,
): GenzyService[] {
  const { services, classes } = microservice;

  services
    .filter((service) => service.type === "REMOTE_PROXY")
    .map((service) => service as RemoteProxy)
    .forEach((service) => {
      const remoteMicroservice = projectData[service.microserviceId];
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
          return createRemoteProxyService(project, projectData[service.microserviceId], service.id);
      }
    });
}

function createRemoteProxyService(project: Project, remoteMicroservice: Microservice, serviceId: string): GenzyService {
  const { services, classes } = remoteMicroservice;
  const remoteService = services.find((service) => service.id === serviceId) as Controller;

  const ports = getPorts(project);
  const port = ports[remoteMicroservice.id];

  return {
    name: remoteService.name,
    type: "RemoteProxy",
    actions: createActions(classes, remoteService.functions, "RemoteProxy"),
    path: remoteService.basePath ?? "/",
    host: `http://localhost:${port}/api`,
  };
}

function nameDependencies(services: Service[], dependencies: string[]): string[] {
  return dependencies.map((dependency) => {
    const service = services.find((service) => service.id === dependency);
    return service?.name ?? "";
  });
}

function createActions(classes: Class[], functions: Function[], serviceType: string): GenzyAction[] {
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
  classes: Class[],
  parameters: FunctionParameter[],
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
  projectData: ProjectDefinitionData,
  microservice: Microservice,
): Record<string, GenzyType> {
  const remoteProxies = microservice.services
    .filter((service) => service.type === "REMOTE_PROXY")
    .map((services) => services as RemoteProxy);

  return remoteProxies.reduce((acc: Record<string, GenzyType>, remoteProxy: RemoteProxy) => {
    const remoteMicroservice = projectData[remoteProxy.microserviceId];
    const remoteService = remoteMicroservice.services.find((service) => service.id === remoteProxy.id) as Controller;

    const compexTypeIds = remoteService.functions.flatMap(extractComplexTypesFromFunction);
    const complexTypes = extractTypesInDepth(remoteMicroservice.classes, compexTypeIds);

    return {
      ...acc,
      ...complexTypes,
    };
  }, {});
}

function extractTypesInDepth(classes: Class[], types: string[]): Record<string, GenzyType> {
  const typesToExtract = [...types];
  const extractedTypes: Record<string, GenzyType> = {};

  while (typesToExtract.length > 0) {
    const typeToExtract = typesToExtract.pop();
    const type = classes.find((_class) => _class.id === typeToExtract) as Class;
    if (extractedTypes[type.name]) continue;

    extractedTypes[type.name] = createType(classes, type);
    typesToExtract.push(...extractComplexTypesFromClass(type));
  }

  return extractedTypes;
}

function extractComplexTypesFromFunction(_function: Function): string[] {
  const typesFromFunction = [_function.returnType, ..._function.params.map((param) => param.type)];

  return typesFromFunction.filter((type) => !primitiveTypes.includes(type));
}

function extractComplexTypesFromClass(_class: Class): string[] {
  const attributeTypes = _class.attributes.map((attribute) => attribute.type);

  return attributeTypes.filter((type) => !primitiveTypes.includes(type));
}

function createTypes(microservice: Microservice): Record<string, GenzyType> {
  const classes = microservice.classes;

  return classes.reduce((types: Record<string, GenzyType>, _class: Class) => {
    types[_class.name] = createType(classes, _class);
    return types;
  }, {});
}

function createType(classes: Class[], _class: Class): GenzyType {
  return _class.attributes.reduce((attributes: GenzyType, attribute: ClassAttribute) => {
    const { name, type, isOptional, isCollection } = attribute;
    attributes[name] = getTypeObject(classes, type, isOptional, isCollection);

    return attributes;
  }, {} as GenzyType);
}

function getTypeObject(
  classes: Class[],
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

function getTypeName(classes: Class[], type: string): string {
  return classes.find((_class) => _class.id === type)?.name ?? "";
}

function isPrimitive(type: string): boolean {
  return primitiveTypes.includes(type);
}
