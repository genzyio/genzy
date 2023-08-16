import { useState, type FC, useEffect } from "react";
import { type Service } from "./models";
import { TextField } from "../../../components/text-field";
import { EditFunction } from "./EditFunction";
import { Button } from "../../../components/button";

type ServiceDrawerProps = {
  service: Service;
  updateService: (service: Service) => void;
  editId?: string;
};

export const ServiceDrawer: FC<ServiceDrawerProps> = ({ service, updateService, editId }) => {
  const [serviceData, setServiceData] = useState(service);
  const [changed, setChanged] = useState(false);

  const types = ["int", "float", "bool", "string", "Model"]; // TODO: Extend with actual models

  useEffect(() => {
    setServiceData(service);
    setChanged(false);
  }, [service]);

  const handleAddAttribute = () => {
    serviceData.functions.push({
      name: "",
      method: "GET",
      params: [],
      returnType: "",
      route: "",
      id: `${+new Date()}`,
    });
    setServiceData({ ...serviceData });
    setChanged(true);
  };

  const update = () => {
    if (!changed) return;
    updateService(serviceData);
    setChanged(false);
  };

  const updateState = (service: Service) => {
    setServiceData(service);
    setChanged(true);
  };

  const handleAddParam = (index: number) => {
    serviceData.functions[index].params.push({
      name: "",
      isCollection: false,
      source: "QUERY",
      type: "",
      id: `${+new Date()}`,
    });
    setServiceData({ ...serviceData });
    setChanged(true);
  };

  const handleDeleteParam = (index: number, paramIndex: number) => {
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
    <div className="mx-8">
      <div className="mb-5">
        <TextField
          value={serviceData.name}
          onChange={(v) => updateState({ ...serviceData, name: v })}
          onBlur={update}
          error={!serviceData.name && "Required"}
        />
      </div>
      {serviceData.functions.map((fun, index) => (
        <EditFunction
          function={fun}
          handleAddParam={handleAddParam}
          handleDelete={handleDelete}
          handleDeleteParam={handleDeleteParam}
          index={index}
          types={types}
          update={update}
          updateState={() => updateState({ ...serviceData })}
          edit={fun.id === editId || !fun.name}
          key={fun.id}
        />
      ))}
      <Button onClick={handleAddAttribute} className="text-sm mt-3">
        New function
      </Button>
    </div>
  );
};
