import { type HandlerType } from "./types";
import { type ProjectDefinition } from "../../models/project-definition.models";

type Position = {
  x: number;
  y: number;
};

const microserviceMovedHandler: HandlerType<{
  microserviceId: string;
  position: Position;
  positionAbsolute: Position;
}> = (projectDefinition: ProjectDefinition, { microserviceId, position, positionAbsolute }) => {
  const microserviceDiagram = projectDefinition.microservices;
  const microserviceNode = microserviceDiagram.nodes.find((node) => node.id === microserviceId);

  microserviceNode.position = position;
  microserviceNode.positionAbsolute = positionAbsolute;
};

const serviceMovedHandler: HandlerType<{
  microserviceId: string;
  serviceId: string;
  position: Position;
  positionAbsolute: Position;
}> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, serviceId, position, positionAbsolute }
) => {
  const serviceDiagram = projectDefinition.services[microserviceId];
  const serviceNode = serviceDiagram.nodes.find((node) => node.id === serviceId);

  serviceNode.position = position;
  serviceNode.positionAbsolute = positionAbsolute;
};

const classMovedHandler: HandlerType<{
  microserviceId: string;
  classId: string;
  position: Position;
  positionAbsolute: Position;
}> = (
  projectDefinition: ProjectDefinition,
  { microserviceId, classId, position, positionAbsolute }
) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  const classNode = classDiagram.nodes.find((node) => node.id === classId);

  classNode.position = position;
  classNode.positionAbsolute = positionAbsolute;
};

export { microserviceMovedHandler, serviceMovedHandler, classMovedHandler };
