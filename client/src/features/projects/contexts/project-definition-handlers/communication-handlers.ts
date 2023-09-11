import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Communication } from "../../../model/microservices/models";
import { addRemoteProxiesHandler, deleteServicesHandler } from "./service-handlers";
import { createMicroserviceEdge } from "../../../model/common/utils/edgeFactories";

// Add

const addCommunicationHandler: HandlerType<{
  params: any;
}> = (projectDefinition: ProjectDefinition, { params }) => {
  const newCommunicationEdge = createMicroserviceEdge(params);

  projectDefinition.microservices.edges.push(newCommunicationEdge);

  return newCommunicationEdge;
};

// Update

const updateCommunicationHandler: HandlerType<{
  communicationId: string;
  communication: Communication;
  newServiceIds: string[];
  removedServiceIds: string[];
}> = (
  projectDefinition: ProjectDefinition,
  { communicationId, communication, newServiceIds, removedServiceIds }
) => {
  const communicationNode = projectDefinition.microservices.edges.find(
    (edge) => edge.id === communicationId
  );

  const sourceMicroserviceId = communicationNode.target;
  const dependentMicroserviceId = communicationNode.source;

  // Add new remote proxies
  addRemoteProxiesHandler(projectDefinition, {
    sourceMicroserviceId,
    dependentMicroserviceId,
    serviceIds: newServiceIds,
  });

  // Remove Proxies using Dispatcher Handler
  deleteServicesHandler(projectDefinition, {
    microserviceId: dependentMicroserviceId,
    serviceIds: removedServiceIds,
  });

  // Update node data
  communicationNode.data = communication;
};

// Remove

const removeCommunicationHandler: HandlerType<{
  communicationId: string;
}> = (projectDefinition: ProjectDefinition, { communicationId }) => {
  // Remove remote proxies
  const communicationNode = projectDefinition.microservices.edges.find(
    (edge) => edge.id === communicationId
  );

  const dependentMicroserviceId = communicationNode.source;
  const removedServiceIds = communicationNode.data.services;
  deleteServicesHandler(projectDefinition, {
    microserviceId: dependentMicroserviceId,
    serviceIds: removedServiceIds,
  });

  // Remove edge from current diagram
  projectDefinition.microservices.edges = projectDefinition.microservices.edges.filter(
    (edge) => edge.id !== communicationId
  );
};

const removeServicesFromCommunicationHandler: HandlerType<{
  communication: Communication;
  serviceIds: string[];
}> = (projectDefinition: ProjectDefinition, { communication, serviceIds }) => {
  communication.services = communication.services.filter((service) => {
    return serviceIds.every((serviceId) => serviceId !== service);
  });
};

export {
  addCommunicationHandler,
  updateCommunicationHandler,
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
};
