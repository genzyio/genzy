type GN1mblyOutput = any;

type GN1mblyClass = any;

type GN1mblyEdge = any;

type N1mblyInfo = {
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

type N1mblyGeneratorInput = { services: N1mblyService[]; types: Record<string, N1mblyType>; n1mblyInfo: N1mblyInfo };

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

export function convertJSON(microserviceId: string, inputJson: GN1mblyOutput): N1mblyGeneratorInput {
  const outputJson: N1mblyGeneratorInput = {
    services: [],
    types: {},
    n1mblyInfo: { name: "", description: "", version: "", basePath: "" },
  };

  const microserviceInfo = inputJson["microservices"]["nodes"].find((m: any) => m.id === microserviceId).data;

  outputJson.services = createServices(inputJson, microserviceId);
  outputJson.types = createTypes(inputJson["classes"][microserviceId]["nodes"]);
  outputJson.n1mblyInfo = createInfo(microserviceInfo);

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

function createServices(inputJson: GN1mblyOutput, microserviceId: string): N1mblyService[] {
  const services = inputJson["services"][microserviceId]["nodes"];
  const classes = inputJson["classes"][microserviceId]["nodes"];
  const edges = inputJson["services"][microserviceId]["edges"];

  return services.map((s: any) => {
    const name = s.data.name;

    switch (s.data.type) {
      case "CONTROLLER":
        return {
          name,
          type: "Controller",
          dependsOn: createDependsOn(s.id, services, edges),
          actions: createActions("Controller", s.data.functions, classes),
          path: `${s.data.basePath ?? "/"}`,
        };

      case "LOCAL":
        return {
          name,
          type: "LocalService",
          dependsOn: createDependsOn(s.id, services, edges),
          actions: createActions("LocalService", s.data.functions, classes),
        };

      default:
        return createRemoteProxyService(inputJson, s.data.microserviceId, s.id);
    }
  });
}

function createRemoteProxyService(
  inputJson: GN1mblyOutput,
  remoteMicroserviceId: string,
  serviceId: string
): N1mblyService {
  const classes = inputJson["classes"][remoteMicroserviceId]["nodes"];
  const remoteService = inputJson["services"][remoteMicroserviceId]["nodes"].find((n: any) => n.id === serviceId).data;

  return {
    name: remoteService.name,
    type: "RemoteProxy",
    actions: createActions("RemoteProxy", remoteService.functions, classes),
    host: "localhost",
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

function createTypes(classes: any): Record<string, N1mblyType> {
  let types: Record<string, Record<string, any>> = {};

  classes.map((c: any) => {
    const attr: Record<string, any> = {};

    c.data.attributes.map((a: any) => {
      attr[a.name] = {
        ...getTypeObject(classes, a.type, a.isOptional, a.isArray),
      };
    });

    types = {
      ...types,
      [c.data.name]: {
        ...attr,
      },
    };
  });

  return types;
}

function getType(classes: any, param: string): string | undefined {
  return classes.find((c: any) => c.id === param)?.data.name;
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
