import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { createServiceEdge } from "../../../model/common/utils/edgeFactories";

// Add

const addDependencyHandler: HandlerType<{
  microserviceId: string;
  params: any;
}> = (projectDefinition: ProjectDefinition, { microserviceId, params }) => {
  const newDependencyEdge = createServiceEdge(
    params,
    params.removable !== undefined ? params.removable : true
  );

  const serviceDiagram = projectDefinition.services[microserviceId];
  serviceDiagram.edges.push(newDependencyEdge);

  return newDependencyEdge;
};

// Update

const updateDependencyHandlesHandler: HandlerType<{
  microserviceId: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, source, target, sourceHandle, targetHandle }
) => {
  const serviceDiagram = projectDefinition.services[microserviceId];
  const dependencyNode = serviceDiagram.edges.find(
    (edge) => edge.source === source && edge.target === target
  );

  dependencyNode.sourceHandle = sourceHandle;
  dependencyNode.targetHandle = targetHandle;
};

// Remove

const removeDependencyHandler: HandlerType<{
  microserviceId: string;
  dependencyId: string;
}> = (projectDefinition: ProjectDefinition, { microserviceId, dependencyId }) => {
  // Remove remote proxies
  const serviceDiagram = projectDefinition.services[microserviceId];
  serviceDiagram.edges = serviceDiagram.edges.filter((edge) => edge.id !== dependencyId);
};

export { addDependencyHandler, updateDependencyHandlesHandler, removeDependencyHandler };
