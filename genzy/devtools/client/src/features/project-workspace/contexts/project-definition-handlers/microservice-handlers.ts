import { type Microservice, type Service } from "../../../diagrams/microservices/models";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { createMicroserviceNode } from "../../../diagrams/common/utils/nodeFactories";

export const defaultViewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

export const defaultDiagram = {
  nodes: [],
  edges: [],
  viewport: defaultViewport,
};

// Add

const addMicroserviceHandler: HandlerType<{ name: string }> = (
  projectDefinition: ProjectDefinition,
  { name }
) => {
  const newMicroserviceNode = createMicroserviceNode({ name });
  projectDefinition.microservices.nodes.push(newMicroserviceNode);

  const microserviceId = newMicroserviceNode.id;
  projectDefinition.services[microserviceId] = { ...defaultDiagram };
  projectDefinition.classes[microserviceId] = { ...defaultDiagram };

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
  return async (dispatcher: DispatcherType) => {
    // Add new Services
    await dispatcher(projectDefinitionActions.addServices, {
      microserviceId,
      services: newServices,
    });

    // Update existing Services
    await dispatcher(projectDefinitionActions.updateServices, {
      microserviceId,
      services: existingServices,
    });

    // Delete Service on current and remote proxies on other diagrams
    const removedServiceIds = removedServices.map((service) => service.id);
    await dispatcher(projectDefinitionActions.deleteServices, {
      microserviceId,
      serviceIds: removedServiceIds,
    });

    // Update Microservice data
    const microserviceNode = projectDefinition.microservices.nodes.find(
      (node) => node.id === microserviceId
    );

    if (microservice) {
      microserviceNode.data.name = microservice.name;
      microserviceNode.data.version = microservice.version;
      microserviceNode.data.basePath = microservice.basePath;
      microserviceNode.data.description = microservice.description;
    }
  };
};

// Delete

const deleteMicroserviceHandler: HandlerType<{ microserviceId: string }> = (
  projectDefinition: ProjectDefinition,
  { microserviceId }
) => {
  return async (dispatcher: DispatcherType) => {
    const microserviceDiagram = projectDefinition.microservices;
    const microserviceData = microserviceDiagram.nodes.find(
      (node) => node.id === microserviceId
    )?.data;
    // Remove all plugins
    for (const plugin of microserviceData?.plugins ?? []) {
      await dispatcher(projectDefinitionActions.uninstallPlugin, {
        microserviceId,
        plugin,
      });
    }

    // Remove all communication to this microservice
    const communications = microserviceDiagram.edges.filter(
      (edge) => edge.target === microserviceId
    );
    for (const edge of communications) {
      await dispatcher(projectDefinitionActions.removeCommunication, {
        communicationId: edge.id,
      });
    }

    // Remove services and classes
    delete projectDefinition.services[microserviceId];
    delete projectDefinition.classes[microserviceId];

    // Remove nodes and edges from current diagram
    microserviceDiagram.nodes = microserviceDiagram.nodes.filter(
      (node) => node.id !== microserviceId
    );
  };
};

export { addMicroserviceHandler, updateMicroserviceHandler, deleteMicroserviceHandler };
