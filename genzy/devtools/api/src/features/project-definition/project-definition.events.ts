import { type Project } from "../projects/projects.models";
import { type CompactMicroservice } from "../../utils/converter/devtools.types";
import { initMicroserviceTsJs } from "../../generators/initMicroservice";
import { reinitializeMicroservicePackageJson } from "../../generators/reinitializeMicroservice";
import { generateMicroserviceCode } from "../../generators/generateMicroserviceCode";
import { convertJSON } from "../../utils/converter/converter";
import { allocatePorts, removePorts } from "../watch-project/ports.manager";
import eventEmitter from "../../core/events/events.utils";
import path from "path";
import fs from "fs";

type ProjectData = Record<string, CompactMicroservice>;
type State = "ADDED" | "MODIFIED" | "REMOVED";
type States = Record<string, State>;

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
    oldProjectData: ProjectData;
    newProjectData: ProjectData;
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

function handleAddedMicroservices(project: Project, projectData: ProjectData, added: string[]) {
  added.forEach((microserviceId: string) => {
    const microserviceData = projectData[microserviceId];
    initMicroserviceTsJs(
      project,
      {
        name: microserviceData.name,
        version: microserviceData.version,
        description: microserviceData.description,
        basePath: microserviceData.basePath,
        plugins: microserviceData.plugins,
      },
      microserviceData.language || "ts",
    );

    generateMicroserviceCode(
      project,
      convertJSON(project, microserviceId, projectData),
      microserviceData.language || "ts",
    );
  });
}

function handleModifiedMicroservices(
  project: Project,
  oldProjectData: ProjectData,
  newProjectData: ProjectData,
  modified: string[],
) {
  modified.forEach((microserviceId: string) => {
    const oldMicroserviceData = oldProjectData[microserviceId];
    const newMicroserviceData = newProjectData[microserviceId];

    if (oldMicroserviceData.name !== newMicroserviceData.name) {
      const newPath = path.join(project.path, newMicroserviceData.name);
      const oldPath = path.join(project.path, oldMicroserviceData.name);
      fs.existsSync(oldPath) && fs.renameSync(oldPath, newPath);
    }

    const microservicePath = path.join(project.path, newMicroserviceData.name);
    if (!fs.existsSync(microservicePath)) {
      initMicroserviceTsJs(project, newMicroserviceData, newMicroserviceData.language || "ts");
    }

    reinitializeMicroservicePackageJson(project, oldMicroserviceData, newMicroserviceData);
    generateMicroserviceCode(
      project,
      convertJSON(project, microserviceId, newProjectData),
      newMicroserviceData.language || "ts",
    );
  });
}

function handleRemovedMicroservices(project: Project, oldProjectData: ProjectData, removed: string[]) {
  removed.forEach((microserviceId: string) => {
    const microserviceData = oldProjectData[microserviceId];
    const microservicePath = path.join(project.path, microserviceData.name);

    fs.rmSync(microservicePath, { recursive: true, force: true });
  });
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
