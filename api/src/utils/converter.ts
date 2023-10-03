import { type Project } from "../features/projects/projects.models";
import { getPorts } from "../features/watch-project/ports.manager";

type GN1mblyOutput = any;

type GN1mblyClass = any;

type GN1mblyEdge = any;

export type N1mblyInfo = {
  name: string;
  description: string;
  version: string;
  basePath: string;
};

type N1mblyService = {
  name: string;
  type: string;
  actions: N1mblyAction[];
  path?: string;
  dependsOn?: any;
  host?: string;
};

type N1mblyServiceName = string;

type N1mblyTypeInfo = {
  type?: string;
  $typeName?: string;
  $isOptional: boolean;
  $isArray: boolean;
};

type N1mblyParameter = {
  name: string;
  source?: string;
  type: N1mblyTypeInfo;
};

type Result = N1mblyTypeInfo;

type N1mblyAction = {
  name: string;
  httpMethod?: string;
  path?: string;
  params: N1mblyParameter[];
  result: Result;
};

type N1mblyType = Record<string, any>;

export type N1mblyGeneratorInput = {
  services: N1mblyService[];
  types: Record<string, N1mblyType>;
  n1mblyInfo: N1mblyInfo;
};

type MicroserviceInfo = N1mblyInfo;

type GN1mblyParameter = {
  name: string;
  isCollection: boolean;
  source?: string;
  type: string;
  id: string;
};

type GN1mblyFunction = {
  name: string;
  method?: string;
  returnType: string;
  returnsCollection: boolean;
  route?: string;
  id: string;
  params: GN1mblyParameter[];
};

export function convertJSON(project: Project, microserviceId: string, inputJson: GN1mblyOutput): N1mblyGeneratorInput {
  const outputJson: N1mblyGeneratorInput = {
    services: [],
    types: {},
    n1mblyInfo: { name: "", description: "", version: "", basePath: "" },
  };

  const microserviceInfo = inputJson["microservices"]["nodes"].find((m: any) => m.id === microserviceId).data;

  outputJson.n1mblyInfo = createInfo(microserviceInfo);
  outputJson.services = createServices(project, inputJson, microserviceId);
  outputJson.types = {
    ...createTypesForRemoteServices(inputJson, microserviceId),
    ...createTypes(inputJson, microserviceId),
  };

  return outputJson;
}

function createInfo(microservice: MicroserviceInfo): N1mblyInfo {
  return {
    name: microservice.name,
    description: microservice.description,
    version: microservice.version,
    basePath: microservice.basePath,
  };
}

function createServices(project: Project, inputJson: GN1mblyOutput, microserviceId: string): N1mblyService[] {
  const services = inputJson["services"][microserviceId]["nodes"];
  const classes = inputJson["classes"][microserviceId]["nodes"];
  const edges = inputJson["services"][microserviceId]["edges"];

  services.forEach((s: any) => {
    if (s.data.type !== "REMOTE_PROXY") return;

    const realService = inputJson["services"][s.data.microserviceId]["nodes"].find((n: any) => n.id === s.id).data;
    s.data.name = realService.name;
  });

  return services
    .filter((s: any) => !["PLUGABLE_SERVICE"].includes(s.data.type))
    .map((s: any) => {
      const name = s.data.name;

      switch (s.data.type) {
        case "CONTROLLER":
          return {
            name,
            type: "Controller",
            dependencies: createDependsOn(s.id, services, edges),
            actions: createActions("Controller", s.data.functions, classes),
            path: s.data.basePath ?? "/",
          };

        case "LOCAL":
          return {
            name,
            type: "LocalService",
            dependencies: createDependsOn(s.id, services, edges),
            actions: createActions("LocalService", s.data.functions, classes),
          };
        case "API_INTEGRATION":
          return {
            name,
            type: "RemoteProxy",
            actions: createActions("Controller", s.data.functions, classes),
            host: s.data.host,
            path: s.data.basePath ?? "/",
          };
        default:
          return createRemoteProxyService(project, inputJson, s.data.microserviceId, s.id);
      }
    });
}

function createRemoteProxyService(
  project: Project,
  inputJson: GN1mblyOutput,
  remoteMicroserviceId: string,
  serviceId: string,
): N1mblyService {
  const classes = inputJson["classes"][remoteMicroserviceId]["nodes"];
  const remoteService = inputJson["services"][remoteMicroserviceId]["nodes"].find((n: any) => n.id === serviceId).data;

  const ports = getPorts(project);
  const port = ports[remoteMicroserviceId];
  return {
    name: remoteService.name,
    type: "RemoteProxy",
    actions: createActions("RemoteProxy", remoteService.functions, classes),
    path: remoteService.basePath ?? "/",
    host: `http://localhost:${port}/api`,
  };
}

function createDependsOn(serviceId: string, services: any, edges: GN1mblyEdge[]): N1mblyServiceName[] {
  return edges
    .filter((e: any) => e.source === serviceId)
    .map((e: any) => services.find((s: any) => s.id === e.target)?.data.name);
}

function createActions(serviceType: string, functions: GN1mblyFunction[], classes: GN1mblyClass[]): N1mblyAction[] {
  return functions.map((f: any) => {
    const params =
      serviceType !== "LocalService" ? createParams(true, f.params, classes) : createParams(false, f.params, classes);

    if (serviceType !== "LocalService") {
      return {
        httpMethod: f.method.toLowerCase(),
        name: f.name,
        path: f.route,
        params,
        result: getTypeObject(classes, f.returnType, f.isOptional, f.returnsCollection),
      };
    }

    return {
      name: f.name,
      params,
      result: getTypeObject(classes, f.returnType, f.isOptional, f.returnsCollection),
    };
  });
}

function createParams(isController: boolean, paramsInput: any, classes: any): N1mblyParameter[] {
  const params: any[] = [];

  paramsInput.map((p: any) => {
    let param: any = {
      name: p.name,
      type: getTypeObject(classes, p.type, p.isCollection, p.isOptional),
    };

    if (isController) {
      param = {
        ...param,
        source: p.source.toLowerCase(),
      };
    }
    params.push(param);
  });

  return params;
}

function createTypesForRemoteServices(inputJson: any, microserviceId: string) {
  const services = inputJson["services"][microserviceId]["nodes"];
  const remoteProxies = services.filter((node: any) => node.data.type === "REMOTE_PROXY");

  return remoteProxies.reduce((acc: any, remoteProxy: any) => {
    const remoteService = inputJson["services"][remoteProxy.data.microserviceId]["nodes"].find(
      (n: any) => n.id === remoteProxy.id,
    ).data;

    const compexTypeIds = remoteService.functions.flatMap(extractComplexTypesFromFunction);
    const complexTypes = extractTypesInDepth(
      inputJson["classes"][remoteProxy.data.microserviceId]["nodes"],
      compexTypeIds,
    );

    return {
      ...acc,
      ...complexTypes,
    };
  }, {});
}

function extractTypesInDepth(classes: any, types: string[]) {
  const typesToExtract = [...types];
  const extractedTypes: any = {};

  while (typesToExtract.length > 0) {
    const typeToExtract = typesToExtract.pop();
    const type = classes.find((node: any) => node.id === typeToExtract);
    if (extractedTypes[type.data.name]) continue;

    extractedTypes[type.data.name] = createType(classes, type);
    typesToExtract.push(...extractComplexTypesFromClass(type.data));
  }

  return extractedTypes;
}

const primitiveTypes = ["any", "int", "float", "boolean", "string", "void"];

function extractComplexTypesFromFunction(_function: any) {
  const typesFromFunction = [_function.returnType, ..._function.params.map((param: any) => param.type)] as string[];

  return typesFromFunction.filter((type) => !primitiveTypes.includes(type));
}

function extractComplexTypesFromClass(_class: any) {
  const attributeTypes = _class.attributes.map((attribute: any) => attribute.type) as string[];

  return attributeTypes.filter((type) => !primitiveTypes.includes(type));
}

function createTypes(inputJson: any, microserviceId: string): Record<string, N1mblyType> {
  const classes = inputJson["classes"][microserviceId]["nodes"];
  return classes.reduce((types: any, c: any) => {
    types[c.data.name] = createType(classes, c);
    return types;
  }, {});
}

function createType(classes: any, type: any) {
  const { attributes } = type.data;

  return attributes.reduce((attributes: any, attribute: any) => {
    const { name, type, isOptional, isCollection } = attribute;
    attributes[name] = getTypeObject(classes, type, isOptional, isCollection);
    return attributes;
  }, {});
}

function getTypeObject(classes: any, type: string, isOptional: boolean, isArray: boolean): N1mblyTypeInfo {
  const typeObj: Record<string, string> = {};
  const typeName = getType(classes, type);
  typeName ? (typeObj["$typeName"] = typeName) : (typeObj["type"] = type);

  return {
    ...typeObj,
    $isOptional: isOptional,
    $isArray: isArray,
  };
}

function getType(classes: any, param: string): string | undefined {
  return classes.find((c: any) => c.id === param)?.data.name;
}
