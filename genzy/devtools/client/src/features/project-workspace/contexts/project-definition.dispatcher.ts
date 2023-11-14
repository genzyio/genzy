import { type ProjectDefinition } from "../models/project-definition.models";
import { type HandlerType } from "./project-definition-handlers/types";
import handlers from "./project-definition-handlers";

export const projectDefinitionActions = {
  addMicroservice: Symbol("addMicroservice"),
  updateMicroservice: Symbol("updateMicroservice"),
  deleteMicroservice: Symbol("deleteMicroservice"),
  microserviceMoved: Symbol("microserviceMoved"),

  installPlugin: Symbol("installPlugin"),
  updatePlugin: Symbol("updatePlugin"),
  uninstallPlugin: Symbol("uninstallPlugin"),

  addCommunication: Symbol("addCommunication"),
  updateCommunication: Symbol("updateCommunication"),
  removeServicesFromCommunication: Symbol("removeServicesFromCommunication"),
  removeCommunication: Symbol("removeCommunication"),

  addService: Symbol("addService"),
  addServices: Symbol("addServices"),
  addRemoteProxy: Symbol("addRemoteProxy"),
  addRemoteProxies: Symbol("addRemoteProxies"),
  addPlugableService: Symbol("addPlugableService"),
  updateService: Symbol("updateService"),
  updateServices: Symbol("updateServices"),
  deleteService: Symbol("deleteServiceHandler"),
  deleteServices: Symbol("deleteServices"),
  serviceMoved: Symbol("serviceMoved"),

  addDependency: Symbol("addDependency"),
  removeDependency: Symbol("removeDependency"),

  addClass: Symbol("addClass"),
  updateClass: Symbol("updateClass"),
  deleteClass: Symbol("deleteClass"),
  classMoved: Symbol("classMoved"),
} as const;

type DispatcherType = (type: symbol, payload: any) => Promise<any>;

function createDispatcher(projectDefinition: ProjectDefinition): DispatcherType {
  const handlersMap: Record<symbol, HandlerType> = {
    [projectDefinitionActions.addMicroservice]: handlers.addMicroserviceHandler,
    [projectDefinitionActions.updateMicroservice]: handlers.updateMicroserviceHandler,
    [projectDefinitionActions.deleteMicroservice]: handlers.deleteMicroserviceHandler,
    [projectDefinitionActions.microserviceMoved]: handlers.microserviceMovedHandler,

    [projectDefinitionActions.installPlugin]: handlers.installPluginHandler,
    [projectDefinitionActions.updatePlugin]: handlers.updatePluginHandler,
    [projectDefinitionActions.uninstallPlugin]: handlers.uninstallPluginHandler,

    [projectDefinitionActions.addCommunication]: handlers.addCommunicationHandler,
    [projectDefinitionActions.updateCommunication]: handlers.updateCommunicationHandler,
    [projectDefinitionActions.removeServicesFromCommunication]:
      handlers.removeServicesFromCommunicationHandler,
    [projectDefinitionActions.removeCommunication]: handlers.removeCommunicationHandler,

    [projectDefinitionActions.addService]: handlers.addServiceHandler,
    [projectDefinitionActions.addServices]: handlers.addServicesHandler,
    [projectDefinitionActions.addRemoteProxy]: handlers.addRemoteProxyHandler,
    [projectDefinitionActions.addRemoteProxies]: handlers.addRemoteProxiesHandler,
    [projectDefinitionActions.addPlugableService]: handlers.addPlugableServiceHandler,
    [projectDefinitionActions.updateService]: handlers.updateServiceHandler,
    [projectDefinitionActions.updateServices]: handlers.updateServicesHandler,
    [projectDefinitionActions.deleteService]: handlers.deleteServiceHandler,
    [projectDefinitionActions.deleteServices]: handlers.deleteServicesHandler,
    [projectDefinitionActions.serviceMoved]: handlers.serviceMovedHandler,

    [projectDefinitionActions.addDependency]: handlers.addDependencyHandler,
    [projectDefinitionActions.removeDependency]: handlers.removeDependencyHandler,

    [projectDefinitionActions.addClass]: handlers.addClassHandler,
    [projectDefinitionActions.updateClass]: handlers.updateClassHandler,
    [projectDefinitionActions.deleteClass]: handlers.deleteClassHandler,
    [projectDefinitionActions.classMoved]: handlers.classMovedHandler,
  };

  return (type: symbol, payload: any) => {
    const handler = handlersMap[type];
    const result = handler(projectDefinition, payload);

    return Promise.resolve(result);
  };
}

export { createDispatcher };

export type { DispatcherType };
