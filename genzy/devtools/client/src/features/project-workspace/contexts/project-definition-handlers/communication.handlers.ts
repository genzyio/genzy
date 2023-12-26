import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Communication } from "@features/diagrams/microservices/models";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { createMicroserviceEdge } from "@features/diagrams/common/utils/edge-factories";

// Add

const addCommunicationHandler: HandlerType<{
  params: any;
}> = (projectDefinition: ProjectDefinition, { params }) => {
  const newCommunicationEdge = createMicroserviceEdge(
    params,
    params.removable !== undefined ? params.removable : true
  );

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
  return async (dispatcher: DispatcherType) => {
    const communicationEdge = projectDefinition.microservices.edges.find(
      (edge) => edge.id === communicationId
    );

    const sourceMicroserviceId = communicationEdge.target;
    const dependentMicroserviceId = communicationEdge.source;

    // Add new remote proxies
    await dispatcher(projectDefinitionActions.addRemoteProxies, {
      sourceMicroserviceId,
      dependentMicroserviceId,
      serviceIds: newServiceIds,
    });

    // Remove Proxies using Dispatcher Handler
    await dispatcher(projectDefinitionActions.deleteServices, {
      microserviceId: dependentMicroserviceId,
      serviceIds: removedServiceIds,
    });

    // Update node data
    communicationEdge.data = communication;
  };
};

// Remove

const removeCommunicationHandler: HandlerType<{
  communicationId: string;
}> = (projectDefinition: ProjectDefinition, { communicationId }) => {
  return async (dispatcher: DispatcherType) => {
    // Remove remote proxies
    const communicationEdge = projectDefinition.microservices.edges.find(
      (edge) => edge.id === communicationId
    );

    const dependentMicroserviceId = communicationEdge.source;
    const removedServiceIds = communicationEdge.data.services || [];
    await dispatcher(projectDefinitionActions.deleteServices, {
      microserviceId: dependentMicroserviceId,
      serviceIds: removedServiceIds,
    });

    // Remove edge from current diagram
    projectDefinition.microservices.edges = projectDefinition.microservices.edges.filter(
      (edge) => edge.id !== communicationId
    );
  };
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
