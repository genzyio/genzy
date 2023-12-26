import { type ProjectDefinition } from "../models/project-definition.models";
import { type State } from "./change-tracker.context";
import { type DispatcherType, projectDefinitionActions } from "./project-definition.dispatcher";

function createChangeTrackingDispatcherWrapper(
  projectDefinition: ProjectDefinition,
  dispacher: DispatcherType,
  setStateForMS: (id: string, state: State) => any
) {
  return async (type: symbol, payload: any) => {
    const result = await dispacher(type, payload);

    switch (type) {
      case projectDefinitionActions.addMicroservice:
        setStateForMS(result.id, "ADDED");
        break;
      case projectDefinitionActions.deleteMicroservice: {
        const node = projectDefinition.microservices.nodes.find(
          (node) => node.id === payload.microserviceId
        );
        const isMicroservice = node.type === "microserviceNode";
        if (isMicroservice) {
          setStateForMS(payload.microserviceId, "REMOVED");
        }
        break;
      }
      case projectDefinitionActions.addRemoteProxy:
      case projectDefinitionActions.addRemoteProxies:
        setStateForMS(payload.dependentMicroserviceId, "MODIFIED");
        break;
      case projectDefinitionActions.addCommunication:
      case projectDefinitionActions.removeCommunication:
      case projectDefinitionActions.updateCommunication:
      case projectDefinitionActions.removeServicesFromCommunication:
        break;
      case projectDefinitionActions.updateService: {
        projectDefinition.microservices.edges
          .filter((edge) => edge.target === payload.microserviceId)
          .filter((edge) => edge.data.services?.includes(payload.service?.id))
          .forEach((edge) => setStateForMS(edge.source, "MODIFIED"));
        break;
      }
      case projectDefinitionActions.microserviceMoved: {
        if (payload?.type === "microserviceNode") {
          setStateForMS(payload.microserviceId, "MODIFIED");
        }
        break;
      }
      default:
        setStateForMS(payload.microserviceId, "MODIFIED");
    }

    return result;
  };
}

export { createChangeTrackingDispatcherWrapper };
