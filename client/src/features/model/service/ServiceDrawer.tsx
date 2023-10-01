import { useState, type FC, useEffect } from "react";
import { type Service, type ServiceType, SERVICE_TYPE_DISPLAY_NAME } from "./models";
import { TextField } from "../../../components/text-field";
import { EditFunction } from "./EditFunction";
import { Button } from "../../../components/button";
import { Select } from "../../../components/select";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { primitiveTypes } from "../class/TypesContext";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import cloneDeep from "lodash.clonedeep";
import { useValidationContext } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";

type ServiceDrawerProps = {
  serviceId: string;
  service: Service;
  updateService: (service: Service) => void;
  nameExists: (name: string) => boolean;
};

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => !["REMOTE_PROXY", "PLUGABLE_SERVICE"].includes(value))
  .map(([value, label]) => ({
    value,
    label,
  }));

export const ServiceDrawer: FC<ServiceDrawerProps> = ({
  serviceId,
  service,
  updateService,
  nameExists,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();
  const { isValid, setValidityFor } = useValidationContext();

  const [serviceData, setServiceData] = useState(cloneDeep(service));

  useEffect(() => {
    setServiceData(cloneDeep(service));
  }, [service]);

  const updateState = (service: Service) => {
    setServiceData(service);
    setCurrentState(service);
  };

  const handleSave = () => {
    updateService(serviceData);
  };

  const nextFunctionName = useSequenceGenerator(serviceData.functions, (f) => f.name, "function");
  const nextApiPath = useSequenceGenerator(serviceData.functions, (f) => f.route, "/route");

  const handleAddFunction = () => {
    serviceData.functions.push({
      name: nextFunctionName(),
      method: "GET",
      params: [],
      returnType: primitiveTypes[0],
      returnsCollection: false,
      route: nextApiPath(),
      id: `${+new Date()}`,
    });
    updateState({ ...serviceData });
  };

  const nextParamName = (index: number) => {
    let i = 1;
    while (serviceData.functions[index].params.find((p) => p.name === `p${i}`)) i++;
    return `p${i}`;
  };

  const handleAddParam = (index: number) => {
    serviceData.functions[index].params.push({
      name: nextParamName(index),
      isCollection: false,
      isOptional: false,
      source: "QUERY",
      type: primitiveTypes[0],
      id: `${+new Date()}`,
    });
    updateState({ ...serviceData });
  };

  const handleDeleteParam = (index: number) => (paramIndex: number) => {
    serviceData.functions[index].params.splice(paramIndex, 1);
    updateState({ ...serviceData });
  };

  const handleDelete = (index: number) => {
    serviceData.functions.splice(index, 1);
    updateState({ ...serviceData });
  };

  const isIdentifier = IDENTIFIER_REGEX.test(serviceData.name);
  const hasUniqueName = !nameExists(serviceData.name);

  const isValidService = isIdentifier && hasUniqueName;
  setValidityFor(serviceId, isValidService);

  return (
    <div className="mx-4">
      <div className="flex mb-1 w-full space-x-2">
        <span className="w-2/3">
          <TextField
            value={serviceData.name}
            onChange={(v) => updateState({ ...serviceData, name: v })}
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
        </span>
        <span className="w-1/3">
          <Select
            value={serviceData.type}
            onChange={(v) => updateState({ ...serviceData, type: v as ServiceType })}
            options={serviceTypeOptions}
          />
        </span>
      </div>
      <div className="flex mb-1 w-full mb-5 space-x-2">
        <span className="w-1/2" hidden={serviceData.type !== "API_INTEGRATION"}>
          <TextField
            value={serviceData.host}
            onChange={(v) =>
              updateState({
                ...serviceData,
                host: v,
              })
            }
            label="Host"
          />
        </span>
        <span
          className={serviceData.type !== "API_INTEGRATION" ? "flex-1" : "w-1/2"}
          hidden={serviceData.type !== "API_INTEGRATION" && serviceData.type !== "CONTROLLER"}
        >
          <TextField
            value={serviceData.basePath}
            onChange={(v) =>
              updateState({
                ...serviceData,
                basePath: v,
              })
            }
            label="Base Path"
          />
        </span>
      </div>
      {!!serviceData.functions?.length && (
        <p>{serviceData.type === "LOCAL" ? "Functions" : "Routes"}</p>
      )}
      {serviceData.functions.map((fun, index) => (
        <EditFunction
          function={fun}
          serviceType={serviceData.type}
          handleAddParam={() => handleAddParam(index)}
          handleDelete={() => handleDelete(index)}
          handleDeleteParam={handleDeleteParam(index)}
          updateState={() => updateState({ ...serviceData })}
          key={fun.id}
          nameExists={(name) =>
            serviceData.functions.some((f) => f.id !== fun.id && f.name === name)
          }
          routeExists={(route, method) =>
            serviceData.functions.some(
              (f) => f.id !== fun.id && f.route === route && f.method === method
            )
          }
        />
      ))}

      <div className="flex justify-between">
        <Button type="button" onClick={handleAddFunction} className="text-sm mt-3">
          New {serviceData.type === "LOCAL" ? "function" : "route"}
        </Button>

        <div className="space-x-1">
          <Button
            type="button"
            className="text-sm mt-3"
            disabled={!isValid || !isDirty}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
