import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Communication } from "../../../model/microservices/models";
import { addRemoteProxiesHandler, deleteServicesHandler } from "./service-handlers";

// Update

const updateCommunicationHandler: HandlerType<{
  communicationId: string;
  newServiceIds: string[];
  removedServiceIds: string[];
}> = (
  projectDefinition: ProjectDefinition,
  { communicationId, newServiceIds, removedServiceIds }
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
};

// Remove

const removeCommunicationHandler: HandlerType<{
  communicationId: string;
}> = (projectDefinition: ProjectDefinition, { communicationId }) => {
  const communicationNode = projectDefinition.microservices.edges.find(
    (edge) => edge.id === communicationId
  );

  const dependentMicroserviceId = communicationNode.source;
  const removedServiceIds = communicationNode.data.services;
  deleteServicesHandler(projectDefinition, {
    microserviceId: dependentMicroserviceId,
    serviceIds: removedServiceIds,
  });
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
  updateCommunicationHandler,
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
};
