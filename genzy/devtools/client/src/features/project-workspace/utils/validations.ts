import { type ProjectDefinition } from "../models/project-definition.models";
import { type State } from "../contexts/change-tracker.context";

function findMicroserviceData(projectDefinition: ProjectDefinition, microserviceId: string) {
  return projectDefinition.microservices.nodes.find((node) => node.id === microserviceId).data;
}

function isValidProject(
  projectDefinition: ProjectDefinition,
  states: Record<string, State>
): [boolean, string] {
  const addedMicroserviceIds = Object.entries(states)
    .filter(([_, state]) => state === "ADDED")
    .map(([microserviceId]) => microserviceId);

  const missingLanguageMicroservices = addedMicroserviceIds
    .map((microserviceId) => findMicroserviceData(projectDefinition, microserviceId))
    .filter((microserviceData) => !microserviceData.language);

  if (missingLanguageMicroservices.length) {
    const microserviceNames = missingLanguageMicroservices.map(({ name }) => name).join(", ");
    return [false, `You must provide a language for ${microserviceNames} before saving.`];
  }
  return [true, ""];
}

export { isValidProject };
