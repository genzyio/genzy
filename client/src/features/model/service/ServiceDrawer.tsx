import { useState, type FC, useEffect } from "react";
import { type Service, type ServiceType, SERVICE_TYPE } from "./models";
import { TextField } from "../../../components/text-field";
import { EditFunction } from "./EditFunction";
import { Button } from "../../../components/button";
import { Select } from "../../../components/select";
import { IDENTIFIER_REGEX } from "../../../patterns";

type ServiceDrawerProps = {
  service: Service;
  updateService: (service: Service) => void;
  nameExists: (name: string) => boolean;
};

export const ServiceDrawer: FC<ServiceDrawerProps> = ({ service, updateService, nameExists }) => {
  const [serviceData, setServiceData] = useState(service);
  const [changed, setChanged] = useState(false);

  const types = ["any", "int", "float", "bool", "string", "void", "Model"]; // TODO: Extend with actual models

  useEffect(() => {
    setServiceData(service);
    setChanged(false);
  }, [service]);

  const updateState = (service: Service) => {
    setServiceData(service);
    setChanged(true);
  };

  const update = () => {
    if (!changed) return;
    updateService(serviceData);
    setChanged(false);
  };

  const nextFunctionName = () => {
    let i = 1;
    while (service.functions.find((f) => f.name === `function${i}`)) i++;
    return `function${i}`;
  };

  const handleAddFunction = () => {
    serviceData.functions.push({
      name: nextFunctionName(),
      method: "GET",
      params: [],
      returnType: types[0],
      returnsCollection: false,
      route: "",
      id: `${+new Date()}`,
    });
    updateState({ ...serviceData });
  };

  const nextParamName = (index: number) => {
    let i = 1;
    while (service.functions[index].params.find((p) => p.name === `p${i}`)) i++;
    return `p${i}`;
  };

  const handleAddParam = (index: number) => {
    serviceData.functions[index].params.push({
      name: nextParamName(index),
      isCollection: false,
      source: "QUERY",
      type: types[0],
      id: `${+new Date()}`,
    });
    updateState({ ...serviceData });
  };

  const handleDeleteParam = (index: number) => (paramIndex: number) => {
    serviceData.functions[index].params.splice(paramIndex, 1);
    updateState({ ...serviceData });
    update();
  };

  const handleDelete = (index: number) => {
    serviceData.functions.splice(index, 1);
    updateState({ ...serviceData });
    update();
  };

  return (
    <div className="mx-4">
      <div className="flex mb-5 w-full">
        <span className="w-2/3">
          <TextField
            value={serviceData.name}
            onChange={(v) => updateState({ ...serviceData, name: v })}
            onBlur={update}
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
            options={Object.keys(SERVICE_TYPE)}
            onBlur={update}
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
          types={types}
          update={update}
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
      <Button onClick={handleAddFunction} className="text-sm mt-3">
        New function
      </Button>
    </div>
  );
};
