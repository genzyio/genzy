import { type ProjectDefinition } from "../../models/project-definition.models";

type HandlerType<TP = any, TR = void> = (projectDefinition: ProjectDefinition, payload: TP) => TR;

export type { HandlerType };
