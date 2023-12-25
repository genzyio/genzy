import { type FC } from "react";
import { type Microservice, type Service } from "../models";
import { Button } from "../../../../core/components/button";
import { EditService } from "./EditService";
import { useSequenceGenerator } from "../../../../core/hooks/useStringSequence";
import { useValidationContext } from "../../common/contexts/validation-context";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check-context";
import { MicroserviceForm } from "./MicroserviceForm";
import { useMicroserviceState } from "./microservice-state";
import { VerticallyFlippable } from "../../../../core/components/wrappers/flippable";
import { createFunctionalComponent } from "../../../../core/utils/components";

const FunctionalEditService = createFunctionalComponent(EditService, "EditService");

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
  const { isDirty } = useDirtyCheckContext();
  const { isValid } = useValidationContext();

  const { microservice, actions } = useMicroserviceState(initialMicroservice);
  const nextName = useSequenceGenerator(
    microservice.services,
    (service) => service.name,
    "Service"
  );

  const handleMicroservicePartialUpdate = (updatedMicroservice: Partial<Microservice>) => {
    actions.updateMicroserviceData(updatedMicroservice);
  };

  const handleAddService = () => {
    actions.addService({ serviceName: nextName() });
  };

  const handleUpdateService = (updatedService: Service) => {
    actions.updateService(updatedService);
  };

  const handleDeleteService = (id: string) => {
    actions.deleteService({ id });
  };

  const handleSave = () => {
    onMicroserviceUpdate({
      ...microservice,
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

      {!!microservice.services?.length && <p>Services</p>}

      <VerticallyFlippable>
        {microservice.services.map((service, index) => (
          <FunctionalEditService
            key={service.id}
            service={service}
            onChange={(updatedService) => {
              handleUpdateService({ id: service.id, ...updatedService });
            }}
            onDelete={() => handleDeleteService(service.id)}
            nameExists={(newServiceName) =>
              microservice.services.some(
                (service, i) => i !== index && service.name === newServiceName
              )
            }
          />
        ))}
      </VerticallyFlippable>
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
