import {
  addMicroserviceHandler,
  updateMicroserviceHandler,
  deleteMicroserviceHandler,
} from "./microservice-handlers";
import {
  addServiceHandler,
  addServicesHandler,
  addRemoteProxyHandler,
  addRemoteProxiesHandler,
  addPlugableServiceHandler,
  updateServiceHandler,
  updateServicesHandler,
  deleteServicesHandler,
} from "./service-handlers";
import { addClassHandler, updateClassHandler, deleteClassHandler } from "./class-handlers";
import {
  addCommunicationHandler,
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
  updateCommunicationHandler,
} from "./communication-handlers";
import { addDependencyHandler, removeDependencyHandler } from "./dependency-handlers";
import {
  installPluginHandler,
  uninstallPluginHandler,
  updatePluginHandler,
} from "./plugins-handlers";
import {
  microserviceMovedHandler,
  serviceMovedHandler,
  classMovedHandler,
} from "./diagram-handlers";

export default {
  addMicroserviceHandler,
  updateMicroserviceHandler,
  deleteMicroserviceHandler,
  addServiceHandler,
  addServicesHandler,
  addRemoteProxyHandler,
  addRemoteProxiesHandler,
  addPlugableServiceHandler,
  updateServiceHandler,
  updateServicesHandler,
  deleteServicesHandler,
  addClassHandler,
  updateClassHandler,
  deleteClassHandler,
  addCommunicationHandler,
  removeCommunicationHandler,
  removeServicesFromCommunicationHandler,
  updateCommunicationHandler,
  addDependencyHandler,
  removeDependencyHandler,
  installPluginHandler,
  uninstallPluginHandler,
  updatePluginHandler,
  microserviceMovedHandler,
  serviceMovedHandler,
  classMovedHandler,
};
