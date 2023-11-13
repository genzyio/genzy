import { type FC, useState } from "react";
import { type Microservice, type Service } from "../models";
import { Button } from "../../../../core/components/button";
import { EditService } from "./EditService";
import { useSequenceGenerator } from "../../../../core/hooks/useStringSequence";
import { useValidationContext } from "../../common/contexts/validation-context";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check-context";
import { MicroserviceForm } from "./MicroserviceForm";

type MicroserviceDrawerProps = {
  microserviceId: string;
  microservice: Microservice;
  onMicroserviceUpdate: (microservice: Microservice) => any;
  nameExists: (name: string) => boolean;
};

export const MicroserviceDrawer: FC<MicroserviceDrawerProps> = ({
  microserviceId,
  microservice: initialMicroservice,
  onMicroserviceUpdate,
  nameExists,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();
  const { isValid } = useValidationContext();

  const [microservice, setMicroservice] = useState({ ...initialMicroservice });
  const [services, setServices] = useState([...initialMicroservice.services]);
  const nextName = useSequenceGenerator(services, (service) => service.name, "Service");

  const handleMicroservicePartialUpdate = (updatedMicroservice: Partial<Microservice>) => {
    setMicroservice((microservice) => ({
      ...microservice,
      ...updatedMicroservice,
    }));

    setCurrentState((state: any) => ({ ...state, ...updatedMicroservice }));
  };

  const handleAddService = () => {
    const newService: Service = {
      id: `${+new Date()}`,
      name: nextName(),
      type: "CONTROLLER",
    };
    const newServices = [...services, newService];
    setServices(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
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
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleDeleteService = (id: string) => {
    const newServices = services.filter((s) => s.id !== id);
    setServices(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleSave = () => {
    onMicroserviceUpdate({
      ...microservice,
      services,
      plugins: initialMicroservice.plugins,
    });
  };

  return (
    <div className="mx-4">
      <MicroserviceForm
        microserviceId={microserviceId}
        microservice={microservice}
        onMicroservicePartialUpdate={handleMicroservicePartialUpdate}
        nameExists={nameExists}
      />

      {!!services?.length && <p>Services</p>}
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
