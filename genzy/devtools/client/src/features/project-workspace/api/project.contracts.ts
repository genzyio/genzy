import { type ProjectDefinition } from "../models/project-definition.models";

type SaveProjectDefinition = {
  projectDefinition: ProjectDefinition;
  states: Record<string, string>;
};

export type { SaveProjectDefinition };
