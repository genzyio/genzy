import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { type Service } from "../../../model/microservices/models";
import {
  createRemoteProxyNode,
  createServiceNode,
} from "../../../model/common/utils/nodeFactories";

// Add

const addServiceHandler: HandlerType<{
  microserviceId: string;
  service: Service;
}> = (projectDefinition: ProjectDefinition, { microserviceId, service }) => {
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

// Update

const updateServiceHandler: HandlerType<{
  microserviceId: string;
  service: Service;
}> = (projectDefinition: ProjectDefinition, { microserviceId, service }) => {
  const serviceDiagram = projectDefinition.services[microserviceId];
  const serviceNode = serviceDiagram.nodes.find((node) => node.id == service.id);

  serviceNode.data.name = service.name;
  serviceNode.data.type = service.type;
};

const updateServicesHandler: HandlerType<{
  microserviceId: string;
  services: Service[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, services }) => {
  services?.map((service) => updateServiceHandler(projectDefinition, { microserviceId, service }));
};

// Delete

const deleteServicesHandler: HandlerType<{
  microserviceId: string;
  serviceIds: string[];
}> = (projectDefinition: ProjectDefinition, { microserviceId, serviceIds }) => {
  const serviceDiagram = projectDefinition.services[microserviceId];

  serviceDiagram.nodes = serviceDiagram.nodes.filter((service) =>
    serviceIds.every((serviceId) => serviceId !== service.id)
  );

  serviceDiagram.edges = serviceDiagram.edges.filter((edge) => {
    return serviceIds.every((serviceId) => serviceId !== edge.target && serviceId !== edge.source);
  });
};

export {
  addServiceHandler,
  addServicesHandler,
  addRemoteProxyHandler,
  addRemoteProxiesHandler,
  updateServiceHandler,
  updateServicesHandler,
  deleteServicesHandler,
};
