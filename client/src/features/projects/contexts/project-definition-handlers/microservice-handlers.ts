import { type Microservice, type Service } from "../../../model/microservices/models";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { removeServicesFromCommunicationHandler } from "./communication-handlers";
import {
  addServicesHandler,
  deleteServicesHandler,
  updateServicesHandler,
} from "./service-handlers";
import { createMicroserviceNode } from "../../../model/common/utils/nodeFactories";

export const defaultViewport = { x: 0, y: 0, zoom: 1 };

// Add

const addMicroserviceHandler: HandlerType<{ name: string }> = (
  projectDefinition: ProjectDefinition,
  { name }
) => {
  const newMicroserviceNode = createMicroserviceNode({ name });
  projectDefinition.microservices.nodes.push(newMicroserviceNode);

  const microserviceId = newMicroserviceNode.id;
  projectDefinition.services[microserviceId] = {
    nodes: [],
    edges: [],
    viewport: defaultViewport,
  };
  projectDefinition.classes[microserviceId] = { nodes: [], viewport: defaultViewport };

  return newMicroserviceNode;
};

// Update

const updateMicroserviceHandler: HandlerType<{
  microserviceId: string;
  microservice?: Microservice;
  newServices: Service[];
  existingServices: Service[];
  removedServices: Service[];
}> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, microservice = undefined, newServices, existingServices, removedServices }
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

  // Update microservice name
  microservice && (microserviceNode.data.name = microservice.name);
};

// Delete

const deleteMicroserviceHandler: HandlerType<{ microserviceId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId }
) => {
  const microserviceData = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  ).data;

  // Remove remote proxies
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

  // Remove services and classews
  delete projectDefinition.services[microserviceId];
  delete projectDefinition.classes[microserviceId];

  // Remove nodes and edges from current diagram
  projectDefinition.microservices.nodes = projectDefinition.microservices.nodes.filter(
    (node) => node.id !== microserviceId
  );
  projectDefinition.microservices.edges = projectDefinition.microservices.edges.filter(
    (edge) => microserviceId !== edge.target && microserviceId !== edge.source
  );
};

export { addMicroserviceHandler, updateMicroserviceHandler, deleteMicroserviceHandler };
