import { type ProjectDefinition } from "../../models/project-definition.models";
import { type HandlerType } from "./types";
import { createClassEdge } from "../../../diagrams/common/utils/edgeFactories";

// Add

const addReferenceHandler: HandlerType<{
  microserviceId: string;
  params: any;
}> = (projectDefinition: ProjectDefinition, { microserviceId, params }) => {
  const newReferenceEdge = createClassEdge(params);

  const classDiagram = projectDefinition.classes[microserviceId];
  classDiagram.edges.push(newReferenceEdge);

  return newReferenceEdge;
};

// Remove

const removeReferenceHandler: HandlerType<{
  microserviceId: string;
  sourceClassId: string;
  targetClassId: string;
}> = (projectDefinition: ProjectDefinition, { microserviceId, sourceClassId, targetClassId }) => {
  const classDiagram = projectDefinition.classes[microserviceId];
  const reference = classDiagram.edges.find(
    (edge) => edge.source === sourceClassId && edge.target === targetClassId
  );

  classDiagram.edges = classDiagram.edges.filter((edge) => edge.id !== reference.id);
};

export { addReferenceHandler, removeReferenceHandler };
