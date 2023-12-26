import { useReducer, useEffect } from "react";
import { type Microservice, type Service } from "../models";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check.context";

type UpdateMicroservicePart = {
  type: "UPDATE_MICROSERVICE_DATA";
  payload: Partial<Omit<Microservice, "services" | "plugins">>;
};

type AddService = {
  type: "ADD_SERVICE";
  payload: { serviceName: string };
};

type UpdateService = {
  type: "UPDATE_SERVICE";
  payload: Service;
};

type DeleteService = {
  type: "DELETE_SERVICE";
  payload: { id: Service["id"] };
};

type MicroserviceAction = UpdateMicroservicePart | AddService | UpdateService | DeleteService;

const microserviceReducer = (microservice: Microservice, action: MicroserviceAction) => {
  switch (action.type) {
    case "UPDATE_MICROSERVICE_DATA": {
      return {
        ...microservice,
        ...action.payload,
      };
    }

    case "ADD_SERVICE": {
      const newService: Service = {
        id: `${+new Date()}`,
        name: action.payload.serviceName,
        type: "CONTROLLER",
      };
      const newServices = [...microservice.services, newService];

      return {
        ...microservice,
        services: newServices,
      };
    }

    case "UPDATE_SERVICE": {
      const updatedService = action.payload;
      const newServices = microservice.services.map((service) => {
        if (service.id === updatedService.id) {
          return {
            ...service,
            name: updatedService.name,
            type: updatedService.type,
          };
        }

        return service;
      });

      return {
        ...microservice,
        services: newServices,
      };
    }

    case "DELETE_SERVICE": {
      const deletedServiceId = action.payload.id;
      const newServices = microservice.services.filter(
        (service) => service.id !== deletedServiceId
      );

      return {
        ...microservice,
        services: newServices,
      };
    }

    default:
      return microservice;
  }
};

export const useMicroserviceState = (initialMicroservice: Microservice) => {
  const [microservice, dispatch] = useReducer(microserviceReducer, {
    ...initialMicroservice,
    services: [...initialMicroservice.services],
  });
  const { setCurrentState } = useDirtyCheckContext();

  useEffect(() => {
    if (!microservice) return;
    setCurrentState({ ...microservice });
  }, [microservice]);

  const actions = {
    updateMicroserviceData: (payload: UpdateMicroservicePart["payload"]) => {
      dispatch({ type: "UPDATE_MICROSERVICE_DATA", payload });
    },
    addService: (payload: AddService["payload"]) => {
      dispatch({ type: "ADD_SERVICE", payload });
    },
    updateService: (payload: UpdateService["payload"]) => {
      dispatch({ type: "UPDATE_SERVICE", payload });
    },
    deleteService: (payload: DeleteService["payload"]) => {
      dispatch({ type: "DELETE_SERVICE", payload });
    },
  };

  return {
    microservice,
    actions,
  };
};
