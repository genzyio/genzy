import { type Connection, MarkerType } from "reactflow";

// Microservice Edge

type CreateMicroserviceEdgeParams = Connection;

function createMicroserviceEdge(params: CreateMicroserviceEdgeParams): any {
  return {
    ...params,
    id: `${+new Date()}`,
    data: {
      services: [],
    },
    type: "removableEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}

// Service Edge

type CreateServiceEdgeParams = Connection;

function createServiceEdge(params: CreateServiceEdgeParams): any {
  return {
    ...params,
    id: `${+new Date()}`,
    data: {
      services: [],
    },
    type: "removableEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}

export { createMicroserviceEdge, createServiceEdge };
