import { useState, type FC } from "react";
import { type Service, type Microservice } from "./models";
import { TextField } from "../../../components/text-field";
import { Button } from "../../../components/button";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { EditService } from "./EditService";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";

type MicroserviceDrawerProps = {
  microservice: Microservice;
  onMicroserviceUpdate: (microservice: Microservice) => any;
  nameExists: (name: string) => boolean;
};

export const MicroserviceDrawer: FC<MicroserviceDrawerProps> = ({
  microservice: initialMicroservice,
  onMicroserviceUpdate,
  nameExists,
}) => {
  const [microserviceName, setMicroserviceName] = useState(initialMicroservice.name);
  const [services, setServices] = useState([...initialMicroservice.services]);

  const nextName = useSequenceGenerator(services, (service) => service.name, "Service");

  const handleAddService = () => {
    const newService: Service = {
      id: `${+new Date()}`,
      name: nextName(),
      type: "CONTROLLER",
    };
    const newServices = [...services, newService];
    setServices(newServices);
  };

  const handleUpdateService = (updatedService: Service) => {
    const newServices = services.map((service) => {
      if (service.id === updatedService.id)
        return {
          ...service,
          name: updatedService.name,
          type: updatedService.type,
        };
      return service;
    });
    setServices(newServices);
  };

  const handleDeleteService = (id: string) => {
    const newServices = services.filter((s) => s.id !== id);
    setServices(newServices);
  };

  const handleSave = () => {
    onMicroserviceUpdate({ name: microserviceName, services });
  };

  return (
    <div className="mx-4">
      <div className="flex mb-5 w-full">
        <TextField
          value={microserviceName}
          onChange={setMicroserviceName}
          error={
            (!IDENTIFIER_REGEX.test(microserviceName) && "Must be an identifier") ||
            (nameExists(microserviceName) && "Already exists")
          }
        />
      </div>

      {services.map((service, index) => (
        <EditService
          key={service.id}
          service={service}
          onChange={(changedService) => {
            handleUpdateService({ id: service.id, ...changedService });
          }}
          onDelete={() => handleDeleteService(service.id)}
          nameExists={(newServiceName) =>
            services.some((service, i) => i !== index && service.name === newServiceName)
          }
        />
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={handleAddService} className="text-sm mt-3">
          New service
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
