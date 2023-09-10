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

type ServiceDrawerProps = {
  service: Service;
  updateService: (service: Service) => void;
  nameExists: (name: string) => boolean;
};

const serviceTypeOptions = Object.entries(SERVICE_TYPE_DISPLAY_NAME)
  .filter(([value, _]) => value !== "REMOTE_PROXY")
  .map(([value, label]) => ({
    value,
    label,
  }));

export const ServiceDrawer: FC<ServiceDrawerProps> = ({ service, updateService, nameExists }) => {
  const [serviceData, setServiceData] = useState(cloneDeep(service));
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setServiceData(cloneDeep(service));
    setChanged(false);
  }, [service]);

  const updateState = (service: Service) => {
    setServiceData(service);
    setChanged(true);
  };

  const handleSave = () => {
    if (!changed) return;
    updateService(serviceData);
    setChanged(false);
  };

  const nextFunctionName = useSequenceGenerator(serviceData.functions, (f) => f.name, "function");
  const nextApiPath = useSequenceGenerator(serviceData.functions, (f) => f.route, "/api/route");

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

  return (
    <div className="mx-4">
      <div className="flex mb-5 w-full">
        <span className="w-2/3">
          <TextField
            value={serviceData.name}
            onChange={(v) => updateState({ ...serviceData, name: v })}
            error={
              (!IDENTIFIER_REGEX.test(serviceData.name) && "Must be an identifier") ||
              (nameExists(serviceData.name) && "Already exists")
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
          New function
        </Button>

        <div className="space-x-1">
          <Button type="button" className="text-sm mt-3" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
