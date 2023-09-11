import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { createServiceEdge } from "../../../model/common/utils/edgeFactories";

// Add

const addDependencyHandler: HandlerType<{
  microserviceId: string;
  params: any;
}> = (projectDefinition: ProjectDefinition, { microserviceId, params }) => {
  const newDependencyEdge = createServiceEdge(params);

  const serviceDiagram = projectDefinition.services[microserviceId];
  serviceDiagram.edges.push(newDependencyEdge);

  return newDependencyEdge;
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

export { addDependencyHandler, removeDependencyHandler };
