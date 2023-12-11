import { type Project } from "../projects/projects.models";
import { type ProjectDefinitionData, type State, type States } from "./project-definition.models";
import { allocatePorts, removePorts } from "../watch-project/ports.manager";
import { initializeAndGenerateMicroservice } from "./commands/initializeAndGenerateMicroservice";
import { reinitializeAndGenerateMicroservice } from "./commands/reinitializeAndGenerateMicroservice";
import { removeMicroservice } from "./commands/removeMicroservice";
import eventEmitter from "../../core/events/events.utils";

export const ProjectDefinitionSaved = Symbol.for("ProjectDefinitionSaved");

eventEmitter.on(
  ProjectDefinitionSaved,
  async ({
    project,
    oldProjectData,
    newProjectData,
    states,
  }: {
    project: Project;
    oldProjectData: ProjectDefinitionData;
    newProjectData: ProjectDefinitionData;
    states: States;
  }) => {
    const { added, modified, removed } = groupMicroserviceIdsBasedOnState(states);

    await removePorts(project, removed);
    await allocatePorts(project, added);

    handleRemovedMicroservices(project, oldProjectData, removed);
    handleModifiedMicroservices(project, oldProjectData, newProjectData, modified);
    handleAddedMicroservices(project, newProjectData, added);
  },
);

function handleAddedMicroservices(project: Project, projectData: ProjectDefinitionData, added: string[]) {
  added.forEach((microserviceId: string) => {
    const microservice = projectData[microserviceId];
    initializeAndGenerateMicroservice(project, projectData, microservice);
  });
}

function handleModifiedMicroservices(
  project: Project,
  oldProjectData: ProjectDefinitionData,
  newProjectData: ProjectDefinitionData,
  modified: string[],
) {
  modified.forEach((microserviceId: string) => {
    const oldMicroservice = oldProjectData[microserviceId];
    const newMicroservice = newProjectData[microserviceId];
    reinitializeAndGenerateMicroservice(project, newProjectData, newMicroservice, oldMicroservice);
  });
}

function handleRemovedMicroservices(project: Project, oldProjectData: ProjectDefinitionData, removed: string[]) {
  removed.forEach((microserviceId: string) => {
    const microservice = oldProjectData[microserviceId];
    removeMicroservice(project, microservice);
  });
}

function groupMicroserviceIdsBasedOnState(states: States) {
  const getMicroserviceIdsBasedOnState = (state: State) => {
    return Object.entries(states)
      .filter(([_, microserviceState]) => microserviceState === state)
      .map(([microserviceId]) => microserviceId);
  };

  return {
    added: getMicroserviceIdsBasedOnState("ADDED"),
    modified: getMicroserviceIdsBasedOnState("MODIFIED"),
    removed: getMicroserviceIdsBasedOnState("REMOVED"),
  };
}
