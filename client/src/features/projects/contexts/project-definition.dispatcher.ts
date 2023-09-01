import { type ProjectDefinition } from "../models/project-definition.models";
import { type HandlerType } from "./project-definition-handlers/types";
import {
  addMicroserviceHandler,
  deleteMicroserviceHandler,
  updateMicroserviceHandler,
} from "./project-definition-handlers/microservice-handlers";
import {
  addServiceHandler,
  addServicesHandler,
  addRemoteProxyHandler,
  addRemoteProxiesHandler,
  updateServiceHandler,
  updateServicesHandler,
  deleteServicesHandler,
} from "./project-definition-handlers/service-handlers";
import { deleteClassHandler } from "./project-definition-handlers/class-handlers";
import {
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
  updateCommunicationHandler,
} from "./project-definition-handlers/communication-handlers";

export const projectDefinitionActions = {
  addMicroservice: Symbol("addMicroservice"),
  updateMicroservice: Symbol("updateMicroservice"),
  deleteMicroservice: Symbol("deleteMicroservice"),

  updateCommunication: Symbol("updateCommunication"),
  removeServicesFromCommunication: Symbol("removeServicesFromCommunication"),
  removeCommunication: Symbol("removeCommunication"),

  addService: Symbol("addService"),
  addServices: Symbol("addServices"),
  addRemoteProxy: Symbol("addRemoteProxy"),
  addRemoteProxies: Symbol("addRemoteProxies"),
  updateService: Symbol("updateService"),
  updateServices: Symbol("updateServices"),
  deleteServices: Symbol("deleteServices"),

  deleteClass: Symbol("deleteClass"),
} as const;

type DispatcherType = (type: symbol, payload: any) => any;

function createDispatcher(projectDefinition: ProjectDefinition): DispatcherType {
  const handlers: Record<symbol, HandlerType> = {
    [projectDefinitionActions.addMicroservice]: addMicroserviceHandler,
    [projectDefinitionActions.updateMicroservice]: updateMicroserviceHandler,
    [projectDefinitionActions.deleteMicroservice]: deleteMicroserviceHandler,

    [projectDefinitionActions.updateCommunication]: updateCommunicationHandler,
    [projectDefinitionActions.removeServicesFromCommunication]:
      removeServicesFromCommunicationHandler,
    [projectDefinitionActions.removeCommunication]: removeCommunicationHandler,

    [projectDefinitionActions.addService]: addServiceHandler,
    [projectDefinitionActions.addServices]: addServicesHandler,
    [projectDefinitionActions.addRemoteProxy]: addRemoteProxyHandler,
    [projectDefinitionActions.addRemoteProxies]: addRemoteProxiesHandler,
    [projectDefinitionActions.updateService]: updateServiceHandler,
    [projectDefinitionActions.updateServices]: updateServicesHandler,
    [projectDefinitionActions.deleteServices]: deleteServicesHandler,

    [projectDefinitionActions.deleteClass]: deleteClassHandler,
  };

  return (type: symbol, payload: any) => handlers[type](projectDefinition, payload);
}

export { createDispatcher };

export type { DispatcherType };
