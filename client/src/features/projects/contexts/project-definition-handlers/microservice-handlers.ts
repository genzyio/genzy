import { type Service } from "../../../model/microservices/models";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { removeServicesFromCommunicationHandler } from "./communication-handlers";
import {
  addServicesHandler,
  deleteServicesHandler,
  updateServicesHandler,
} from "./service-handlers";

export const defaultViewport = { x: 0, y: 0, zoom: 1 };

// Add

const addMicroserviceHandler: HandlerType<{ microserviceId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId }
) => {
  projectDefinition.services[microserviceId] = {
    nodes: [],
    edges: [],
    viewport: defaultViewport,
  };
  projectDefinition.classes[microserviceId] = { nodes: [], viewport: defaultViewport };
};

// Update

const updateMicroserviceHandler: HandlerType<{
  microserviceId: string;
  newServices: Service[];
  existingServices: Service[];
  removedServices: Service[];
}> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, newServices, existingServices, removedServices }
) => {
  const microserviceDiagram = projectDefinition.microservices;

  // Add new Services
  addServicesHandler(projectDefinition, {
    microserviceId,
    services: newServices,
  });

  // Update existing Services
  updateServicesHandler(projectDefinition, {
    microserviceId,
    services: existingServices,
  });

  // Delete Service on current and remote proxies on other diagrams
  const removedServiceIds = removedServices.map((service) => service.id);

  deleteServicesHandler(projectDefinition, {
    microserviceId,
    serviceIds: removedServiceIds,
  });

  const dependentCommunication = microserviceDiagram.edges.filter(
    (edge) => edge.target === microserviceId
  );
  dependentCommunication.forEach((edge) => {
    removeServicesFromCommunicationHandler(projectDefinition, {
      communication: edge.data,
      serviceIds: removedServiceIds,
    });

    const dependentMicroserviceId = edge.source;
    deleteServicesHandler(projectDefinition, {
      microserviceId: dependentMicroserviceId,
      serviceIds: removedServiceIds,
    });
  });

  const microserviceNode = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  );
  microserviceNode.data.services = microserviceNode.data.services.filter((service) =>
    removedServices.every((removedService) => removedService.id !== service.id)
  );
};

// Delete

const deleteMicroserviceHandler: HandlerType<{ microserviceId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId }
) => {
  const microserviceData = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  ).data;

  const dependentMicroservicesIds = projectDefinition.microservices.edges
    .filter((edge) => edge.target === microserviceId)
    .map((edge) => edge.source);
  const removedServicesIds = microserviceData.services.map((service) => service.id);
  dependentMicroservicesIds.forEach((dependentMicroserviceId) => {
    deleteServicesHandler(projectDefinition, {
      microserviceId: dependentMicroserviceId,
      serviceIds: removedServicesIds,
    });
  });

  delete projectDefinition.services[microserviceId];
  delete projectDefinition.classes[microserviceId];
};

export { addMicroserviceHandler, updateMicroserviceHandler, deleteMicroserviceHandler };
