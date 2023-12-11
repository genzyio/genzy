import { type Connection, MarkerType } from "reactflow";

// Microservice Edge

type CreateMicroserviceEdgeParams = Connection;

function createMicroserviceEdge(
  params: CreateMicroserviceEdgeParams,
  removable: boolean = true
): any {
  return {
    ...params,
    id: `${+new Date()}`,
    data: {
      services: [],
    },
    type: removable ? "removableEdge" : "defaultEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}

// Service Edge

type CreateServiceEdgeParams = Connection;

function createServiceEdge(params: CreateServiceEdgeParams, removable: boolean = true): any {
  return {
    ...params,
    id: `${+new Date()}`,
    data: {
      services: [], // TODO: Da li mi treba ovo?
    },
    type: removable ? "removableEdge" : "defaultEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
  };
}

// Class Edge

type CreateClassEdgeParams = Pick<Connection, "source" | "target">;

function createClassEdge(params: CreateClassEdgeParams): any {
  return {
    ...params,
    id: `${+new Date()}_${params.target}`,
    data: {},
    type: "defaultEdge",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 30,
      height: 30,
    },
    sourceHandle: "top",
    targetHandle: "bottom",
  };
}

export { createMicroserviceEdge, createServiceEdge, createClassEdge };
