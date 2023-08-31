import { type Node } from "reactflow";
import { type Service } from "../../service/models";
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
      services: [],
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
    position: { x: 0, y: 0 },
    data: {
      microserviceId,
      name,
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
    position: { x: 0, y: 0 },
    data: {
      microserviceId: microserviceId,
      name: "",
      functions: [],
      type: "REMOTE_PROXY",
    },
    type: "remoteProxyNode",
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
    position: { x: 0, y: 0 },
    data: {
      microserviceId,
      name,
      methods: [],
      attributes: [],
    },
    type: "classNode",
  };
}

export { createMicroserviceNode, createServiceNode, createRemoteProxyNode, createClassNode };
