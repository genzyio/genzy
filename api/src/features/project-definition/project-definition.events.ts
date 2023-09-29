import { type Project } from "../projects/projects.models";
import { initMicroserviceTsJs, reinitializeMicroservicePackageJson } from "../../generators/initMicroservice";
import { generateMicroserviceCode } from "../../generators/generateMicroserviceCode";
import { convertJSON } from "../../utils/converter";
import eventEmitter from "../../core/events/events.utils";
import path from "path";
import fs from "fs";

type State = "ADDED" | "MODIFIED" | "REMOVED";
type States = Record<string, State>;

export const ProjectDefinitionSaved = Symbol.for("ProjectDefinitionSaved");

eventEmitter.on(
  ProjectDefinitionSaved,
  ({
    project,
    oldProjectDefinition,
    newProjectDefinition,
    states,
  }: {
    project: Project;
    oldProjectDefinition: any;
    newProjectDefinition: any;
    states: States;
  }) => {
    const { added, modified, removed } = groupMicroserviceIdsBasedOnState(states);

    handleAddedMicroservices(project, newProjectDefinition, added);
    handleModifiedMicroservices(project, oldProjectDefinition, newProjectDefinition, modified);
    handleRemovedMicroservices(project, oldProjectDefinition, removed);
  },
);

function handleAddedMicroservices(project: Project, projectDefinition: any, added: string[]) {
  added.forEach((microserviceId: string) => {
    const microserviceData = findMicroserviceNode(projectDefinition, microserviceId).data;
    initMicroserviceTsJs(
      project,
      {
        name: microserviceData.name,
        version: microserviceData.version,
        description: microserviceData.description,
        basePath: microserviceData.basePath,
      },
      "ts",
    );

    generateMicroserviceCode(project, convertJSON(microserviceId, projectDefinition), "ts");
  });

  // TODO: Handle plugins
}

function handleModifiedMicroservices(
  project: Project,
  oldProjectDefinition: any,
  newProjectDefinition: any,
  modified: string[],
) {
  modified.forEach((microserviceId: string) => {
    const oldMicroserviceData = findMicroserviceNode(oldProjectDefinition, microserviceId).data;
    const newMicroserviceData = findMicroserviceNode(newProjectDefinition, microserviceId).data;

    if (oldMicroserviceData.name !== newMicroserviceData.name) {
      const newPath = path.join(project.path, newMicroserviceData.name);
      const oldPath = path.join(project.path, oldMicroserviceData.name);
      fs.existsSync(oldPath) && fs.renameSync(oldPath, newPath);
    }

    const microservicePath = path.join(project.path, newMicroserviceData.name);
    if (!fs.existsSync(microservicePath)) {
      initMicroserviceTsJs(project, newMicroserviceData, "ts");
    }

    reinitializeMicroservicePackageJson(project, newMicroserviceData);
    generateMicroserviceCode(project, convertJSON(microserviceId, newProjectDefinition), "ts");
  });

  // TODO: Handle plugins
}

function handleRemovedMicroservices(project: Project, oldProjectDefinition: any, removed: string[]) {
  removed.forEach((microserviceId: string) => {
    const microserviceData = findMicroserviceNode(oldProjectDefinition, microserviceId).data;
    const microservicePath = path.join(project.path, microserviceData.name);

    fs.rmSync(microservicePath, { recursive: true, force: true });
  });
}

function findMicroserviceNode(projectDefinition: any, microserviceId: string) {
  return projectDefinition.microservices.nodes.find((node: any) => node.id === microserviceId);
}

function groupMicroserviceIdsBasedOnState(states: States) {
  const getMicroserviceIdsBasedOnState = (state: State) => {
    return Object.entries(states)
      .filter(([_, microserviceState]: [string, State]) => microserviceState === state)
      .map(([microserviceId]) => microserviceId);
  };

  return {
    added: getMicroserviceIdsBasedOnState("ADDED"),
    modified: getMicroserviceIdsBasedOnState("MODIFIED"),
    removed: getMicroserviceIdsBasedOnState("REMOVED"),
  };
}
