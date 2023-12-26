import { type DispatcherType, projectDefinitionActions } from "../project-definition.dispatcher";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Service } from "@features/diagrams/microservices/models";
import {
  type ServiceFunction,
  type Service as ExtendedService,
} from "@features/diagrams/service/models";
import {
  createServiceNode,
  createRemoteProxyNode,
  createPlugableServiceNode,
} from "@features/diagrams/common/utils/node-factories";

// Add

const addServiceHandler: HandlerType<{
  microserviceId: string;
  service: Service;
}> = (projectDefinition: ProjectDefinition, { microserviceId, service }) => {
  const microserviceNode = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  );
  microserviceNode.data.services.push(service);

  const serviceDiagram = projectDefinition.services[microserviceId];
  const newServiceNode = createServiceNode({
    serviceId: service.id,
    microserviceId: microserviceId,
    name: service.name,
    type: service.type,
  });

  serviceDiagram.nodes.push(newServiceNode);

  return newServiceNode;
};

const addServicesHandler: HandlerType<{
  microserviceId: string;
  services: Service[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, services }) => {
  return services?.map((service) =>
    addServiceHandler(projectDefinition, { microserviceId, service })
  );
};

const addRemoteProxyHandler: HandlerType<{
  sourceMicroserviceId: string;
  dependentMicroserviceId: string;
  serviceId: string;
}> = (
  projectDefinition: ProjectDefinition,
  { sourceMicroserviceId, dependentMicroserviceId, serviceId }
) => {
  const dependentServiceDiagram = projectDefinition.services[dependentMicroserviceId];
  const newRemoteProxyNode = createRemoteProxyNode({
    microserviceId: sourceMicroserviceId,
    serviceId,
  });

  dependentServiceDiagram.nodes.push(newRemoteProxyNode);

  return newRemoteProxyNode;
};

const addRemoteProxiesHandler: HandlerType<{
  sourceMicroserviceId: string;
  dependentMicroserviceId: string;
  serviceIds: string[];
}> = (
  projectDefinition: ProjectDefinition,
  { sourceMicroserviceId, dependentMicroserviceId, serviceIds }
) => {
  return serviceIds?.map((serviceId) =>
    addRemoteProxyHandler(projectDefinition, {
      sourceMicroserviceId,
      dependentMicroserviceId,
      serviceId,
    })
  );
};

const addPlugableServiceHandler: HandlerType<{
  microserviceId: string;
  plugin: string;
  serviceId: string;
  service: Pick<ExtendedService, "name" | "functions">;
}> = (projectDefinition: ProjectDefinition, { microserviceId, plugin, serviceId, service }) => {
  const serviceDiagram = projectDefinition.services[microserviceId];
  const newPlugableServiceNode = createPlugableServiceNode({
    serviceId,
    microserviceId,
    plugin,
    name: service.name,
    functions: service.functions,
  });

  serviceDiagram.nodes.push(newPlugableServiceNode);
};

// Update

const updateServiceHandler: HandlerType<{
  microserviceId: string;
  service: Service;
  functions?: ServiceFunction[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, service, functions = undefined }) => {
  const microserviceNode = projectDefinition.microservices.nodes.find(
    (node) => node.id === microserviceId
  );
  const serviceData = microserviceNode.data.services.find((s) => s.id === service.id);
  serviceData.name = service.name;
  serviceData.type = service.type;

  const serviceDiagram = projectDefinition.services[microserviceId];
  const serviceNode = serviceDiagram.nodes.find((node) => node.id == service.id);

  serviceNode.data.name = service.name;
  serviceNode.data.type = service.type;
  functions && (serviceNode.data.functions = functions);
};

const updateServicesHandler: HandlerType<{
  microserviceId: string;
  services: Service[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, services }) => {
  services?.map((service) => updateServiceHandler(projectDefinition, { microserviceId, service }));
};

// Delete

const deleteServiceHandler: HandlerType<{
  microserviceId: string;
  serviceId: string;
}> = (projectDefinition: ProjectDefinition, { microserviceId, serviceId }) => {
  return async (dispatcher: DispatcherType) => {
    // Remove from current service diagram
    const serviceDiagram = projectDefinition.services[microserviceId];
    serviceDiagram.nodes = serviceDiagram.nodes.filter((service) => service.id !== serviceId);
    serviceDiagram.edges = serviceDiagram.edges.filter(
      (edge) => edge.target !== serviceId && edge.source !== serviceId
    );

    // Remove from Microservice node data
    const microserviceDiagram = projectDefinition.microservices;
    const microserviceNode = microserviceDiagram.nodes.find((node) => node.id === microserviceId);
    microserviceNode.data.services = microserviceNode.data.services.filter(
      (service) => service.id !== serviceId
    );

    // Remove deleted service from communication and dependent microservices
    const dependentCommunications = microserviceDiagram.edges.filter(
      (edge) => edge.target === microserviceId
    );
    for (const edge of dependentCommunications) {
      if (!edge.data.services.includes(serviceId)) {
        continue;
      }

      await dispatcher(projectDefinitionActions.removeServicesFromCommunication, {
        communication: edge.data,
        serviceIds: [serviceId],
      });

      await dispatcher(projectDefinitionActions.deleteService, {
        microserviceId: edge.source,
        serviceId,
      });
    }
  };
};

const deleteServicesHandler: HandlerType<{
  microserviceId: string;
  serviceIds: string[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, serviceIds }) => {
  return async (dispatcher: DispatcherType) => {
    for (const serviceId of serviceIds) {
      await dispatcher(projectDefinitionActions.deleteService, { microserviceId, serviceId });
    }
  };
};

export {
  addServiceHandler,
  addServicesHandler,
  addRemoteProxyHandler,
  addRemoteProxiesHandler,
  addPlugableServiceHandler,
  updateServiceHandler,
  updateServicesHandler,
  deleteServiceHandler,
  deleteServicesHandler,
};
