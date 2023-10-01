import { type Node } from "reactflow";
import { type Service, type ServiceFunction } from "../../service/models";
import { type Microservice } from "../../microservices/models";
import { type Class } from "../../class/models";

// Microservice Node

type CreateMicroserviceNodeParams = {
  name: string;
};

function createMicroserviceNode({ name }: CreateMicroserviceNodeParams): Node<Microservice> {
  const microserviceId = `${+new Date()}`;
  return {
    id: microserviceId,
    position: { x: 0, y: 0 },
    data: {
      name,
      version: "0.0.0",
      description: "",
      basePath: "/api",
      services: [],
      plugins: [],
    },
    type: "microserviceNode",
  };
}

// Service Nodes

type CreateServiceNodeParams = {
  serviceId: string;
  microserviceId: string;
  name: string;
  type: "LOCAL" | "CONTROLLER";
};

function createServiceNode({
  serviceId,
  microserviceId,
  name,
  type,
}: CreateServiceNodeParams): Node<Service> {
  return {
    id: serviceId,
    position: { x: 25, y: 25 },
    data: {
      microserviceId,
      name,
      host: "",
      basePath: "",
      functions: [],
      type,
    },
    type: "serviceNode",
  };
}

type CreateRemoteProxyNodeParams = {
  serviceId: string;
  microserviceId: string;
};

function createRemoteProxyNode({
  serviceId,
  microserviceId,
}: CreateRemoteProxyNodeParams): Node<Service> {
  return {
    id: serviceId,
    position: { x: 25, y: 25 },
    data: {
      microserviceId: microserviceId,
      name: "",
      host: "",
      basePath: "",
      functions: [],
      type: "REMOTE_PROXY",
    },
    type: "remoteProxyNode",
  };
}

type CreatePlugableServiceNodeParam = {
  serviceId: string;
  microserviceId: string;
  name: string;
  functions: ServiceFunction[];
};

function createPlugableServiceNode({
  serviceId,
  microserviceId,
  name,
  functions,
}: CreatePlugableServiceNodeParam): Node<Service> {
  return {
    id: serviceId,
    position: { x: 25, y: 25 },
    data: {
      microserviceId: microserviceId,
      name,
      host: "",
      basePath: "",
      functions,
      type: "PLUGABLE_SERVICE",
    },
    type: "plugableServiceNode",
  };
}

// Class Node

type CreateClassNodeParams = {
  microserviceId: string;
  name: string;
};

function createClassNode({ microserviceId, name }: CreateClassNodeParams): Node<Class> {
  const classId = `${+new Date()}`;
  return {
    id: classId,
    position: { x: 25, y: 25 },
    data: {
      microserviceId,
      name,
      methods: [],
      attributes: [],
    },
    type: "classNode",
  };
}

export {
  createMicroserviceNode,
  createServiceNode,
  createRemoteProxyNode,
  createPlugableServiceNode,
  createClassNode,
};
