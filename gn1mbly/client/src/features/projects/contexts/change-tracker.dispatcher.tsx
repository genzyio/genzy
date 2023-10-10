import { type State } from "./change-tracker-context";
import { type DispatcherType, projectDefinitionActions } from "./project-definition.dispatcher";

function createChangeTrackingDispatcherWrapper(
  dispacher: DispatcherType,
  setStateForMS: (id: string, state: State) => any
) {
  return (type: symbol, payload: any) => {
    const result = dispacher(type, payload);

    switch (type) {
      case projectDefinitionActions.addMicroservice:
        setStateForMS(result.id, "ADDED");
        break;
      case projectDefinitionActions.deleteMicroservice:
        setStateForMS(payload.microserviceId, "REMOVED");
        break;
      case projectDefinitionActions.addRemoteProxy:
      case projectDefinitionActions.addRemoteProxies:
        setStateForMS(payload.dependentMicroserviceId, "MODIFIED");
        break;
      case projectDefinitionActions.addCommunication:
      case projectDefinitionActions.removeCommunication:
      case projectDefinitionActions.updateCommunication:
      case projectDefinitionActions.removeServicesFromCommunication:
        break;
      case projectDefinitionActions.microserviceMoved:
        if (payload?.type !== "microserviceNode") break;
      default:
        setStateForMS(payload.microserviceId, "MODIFIED");
    }

    return result;
  };
}

export { createChangeTrackingDispatcherWrapper };
