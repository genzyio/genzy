import { type Project } from "../projects/projects.models";
import { initMicroserviceTsJs, reinitializeMicroservicePackageJson } from "../../generators/initMicroservice";
import { generateMicroserviceCode } from "../../generators/generateMicroserviceCode";
import { convertJSON } from "../../utils/converter";
import { allocatePorts, removePorts } from "../watch-project/ports.manager";
import eventEmitter from "../../core/events/events.utils";
import path from "path";
import fs from "fs";

type State = "ADDED" | "MODIFIED" | "REMOVED";
type States = Record<string, State>;

export const ProjectDefinitionSaved = Symbol.for("ProjectDefinitionSaved");

eventEmitter.on(
  ProjectDefinitionSaved,
  async ({
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

    await removePorts(project, removed);
    await allocatePorts(project, added);

    handleRemovedMicroservices(project, oldProjectDefinition, removed);
    handleModifiedMicroservices(project, oldProjectDefinition, newProjectDefinition, modified);
    handleAddedMicroservices(project, newProjectDefinition, added);
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
        packages: microserviceData.packages,
      },
      "ts",
    );

    generateMicroserviceCode(project, convertJSON(project, microserviceId, projectDefinition), "ts");
  });
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

    reinitializeMicroservicePackageJson(project, oldMicroserviceData, newMicroserviceData);
    generateMicroserviceCode(project, convertJSON(project, microserviceId, newProjectDefinition), "ts");
  });
}

function handleRemovedMicroservices(project: Project, oldProjectDefinition: any, removed: string[]) {
  removed.forEach((microserviceId: string) => {
    const microserviceData = findMicroserviceNode(oldProjectDefinition, microserviceId).data;
    const microservicePath = path.join(project.path, microserviceData.name);

    fs.rmSync(microservicePath, { recursive: true, force: true });
  });
}

function findMicroserviceNode(projectDefinition: any, microserviceId: string) {
  const microserviceNode = projectDefinition.microservices.nodes.find((node: any) => node.id === microserviceId);
  microserviceNode.data.packages = microserviceNode.data.plugins || [];

  return microserviceNode;
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
