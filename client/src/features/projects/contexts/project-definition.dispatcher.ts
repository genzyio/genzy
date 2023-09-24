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
import {
  addClassHandler,
  updateClassHandler,
  deleteClassHandler,
} from "./project-definition-handlers/class-handlers";
import {
  addCommunicationHandler,
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
  updateCommunicationHandler,
  updateCommunicationHandlesHandler,
} from "./project-definition-handlers/communication-handlers";
import {
  addDependencyHandler,
  removeDependencyHandler,
  updateDependencyHandlesHandler,
} from "./project-definition-handlers/dependency-handlers";

export const projectDefinitionActions = {
  addMicroservice: Symbol("addMicroservice"),
  updateMicroservice: Symbol("updateMicroservice"),
  deleteMicroservice: Symbol("deleteMicroservice"),

  addCommunication: Symbol("addCommunication"),
  updateCommunication: Symbol("updateCommunication"),
  updateCommunicationHandles: Symbol("updateCommunicationHandles"),
  removeServicesFromCommunication: Symbol("removeServicesFromCommunication"),
  removeCommunication: Symbol("removeCommunication"),

  addService: Symbol("addService"),
  addServices: Symbol("addServices"),
  addRemoteProxy: Symbol("addRemoteProxy"),
  addRemoteProxies: Symbol("addRemoteProxies"),
  updateService: Symbol("updateService"),
  updateServices: Symbol("updateServices"),
  deleteServices: Symbol("deleteServices"),

  addDependency: Symbol("addDependency"),
  updateDependencyHandles: Symbol("updateDependencyHandles"),
  removeDependency: Symbol("removeDependency"),

  addClass: Symbol("addClass"),
  updateClass: Symbol("updateClass"),
  deleteClass: Symbol("deleteClass"),
} as const;

type DispatcherType = (type: symbol, payload: any) => any;

function createDispatcher(projectDefinition: ProjectDefinition): DispatcherType {
  const handlers: Record<symbol, HandlerType> = {
    [projectDefinitionActions.addMicroservice]: addMicroserviceHandler,
    [projectDefinitionActions.updateMicroservice]: updateMicroserviceHandler,
    [projectDefinitionActions.deleteMicroservice]: deleteMicroserviceHandler,

    [projectDefinitionActions.addCommunication]: addCommunicationHandler,
    [projectDefinitionActions.updateCommunication]: updateCommunicationHandler,
    [projectDefinitionActions.updateCommunicationHandles]: updateCommunicationHandlesHandler,
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

    [projectDefinitionActions.addDependency]: addDependencyHandler,
    [projectDefinitionActions.updateDependencyHandles]: updateDependencyHandlesHandler,
    [projectDefinitionActions.removeDependency]: removeDependencyHandler,

    [projectDefinitionActions.addClass]: addClassHandler,
    [projectDefinitionActions.updateClass]: updateClassHandler,
    [projectDefinitionActions.deleteClass]: deleteClassHandler,
  };

  return (type: symbol, payload: any) => handlers[type](projectDefinition, payload);
}

export { createDispatcher };

export type { DispatcherType };
