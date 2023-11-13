import { type Microservice, type Service } from "../../../diagrams/microservices/models";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { createMicroserviceNode } from "../../../diagrams/common/utils/nodeFactories";

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
  return (dispatcher: DispatcherType) => {
    // Add new Services
    dispatcher(projectDefinitionActions.addServices, {
      microserviceId,
      services: newServices,
    });

    // Update existing Services
    dispatcher(projectDefinitionActions.updateServices, {
      microserviceId,
      services: existingServices,
    });

    // Delete Service on current and remote proxies on other diagrams
    const removedServiceIds = removedServices.map((service) => service.id);
    dispatcher(projectDefinitionActions.deleteServices, {
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
  return (dispatcher: DispatcherType) => {
    const microserviceDiagram = projectDefinition.microservices;

    // Remove all communication to this microservice
    microserviceDiagram.edges
      .filter((edge) => edge.target === microserviceId)
      .forEach((edge) =>
        dispatcher(projectDefinitionActions.removeCommunication, {
          communicationId: edge.id,
        })
      );

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
