import { useState, type FC, useEffect } from "react";
import { type Service } from "../models";
import { EditFunction } from "./EditFunction";
import { Button } from "../../../../core/components/button";
import { primitiveTypes } from "../../class/TypesContext";
import { useSequenceGenerator } from "../../../../core/hooks/useStringSequence";
import cloneDeep from "lodash.clonedeep";
import { useValidationContext } from "../../common/contexts/validation-context";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check-context";
import { ServiceForm } from "./ServiceForm";
import { VerticallyFlippable } from "../../../../core/components/wrappers/flippable";
import { createFunctionalComponent } from "../../../../core/utils/components";

const FunctionalEditFunction = createFunctionalComponent(EditFunction, "EditFunction");

type ServiceDrawerProps = {
  serviceId: string;
  service: Service;
  updateService: (service: Service) => void;
  nameExists: (name: string) => boolean;
};

export const ServiceDrawer: FC<ServiceDrawerProps> = ({
  serviceId,
  service,
  updateService,
  nameExists,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();
  const { isValid } = useValidationContext();

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
    while (serviceData.functions[index].params.find((p) => p.name === `param${i}`)) i++;
    return `param${i}`;
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

  const handleDeleteFunction = (index: number) => {
    serviceData.functions.splice(index, 1);
    updateState({ ...serviceData });
  };

  return (
    <div className="mx-4">
      <ServiceForm
        serviceId={serviceId}
        service={serviceData}
        onServicePartialUpdate={(servicePart) => {
          updateState({
            ...serviceData,
            ...servicePart,
          });
        }}
        nameExists={nameExists}
      />

      {!!serviceData.functions?.length && (
        <p>{serviceData.type === "LOCAL" ? "Functions" : "Routes"}</p>
      )}
      <VerticallyFlippable>
        {serviceData.functions.map((fun, index) => (
          <FunctionalEditFunction
            function={fun}
            serviceType={serviceData.type}
            handleDelete={() => handleDeleteFunction(index)}
            handleAddParam={() => handleAddParam(index)}
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
      </VerticallyFlippable>
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
