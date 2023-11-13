import { type FC, useState } from "react";
import type { Service, Communication } from "../models";
import { Checkbox } from "../../../../core/components/checkbox";
import { Button } from "../../../../core/components/button";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check-context";

type CommunicationDrawerProps = {
  communication: Communication;
  possibleServices: Service[];
  onCommunicationUpdate: (communication: Communication) => any;
};

export const CommunicationDrawer: FC<CommunicationDrawerProps> = ({
  communication,
  possibleServices,
  onCommunicationUpdate,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();

  const [selectedServices, setSelectedService] = useState(communication.services);

  const handleCheck = (serviceId: string, checked: boolean) => {
    const newServices = checked
      ? [...selectedServices, serviceId]
      : selectedServices.filter((sId) => sId !== serviceId);
    setSelectedService(newServices);
    setCurrentState((state: any) => ({ ...state, services: newServices }));
  };

  const handleSave = () => {
    onCommunicationUpdate({ services: selectedServices });
  };

  return (
    <>
      <div className="mx-4">
        {possibleServices?.map((service: Service) => {
          return (
            <Checkbox
              key={service.id}
              label={service.name}
              checked={selectedServices.includes(service.id)}
              onChange={(checked) => handleCheck(service.id, checked)}
            />
          );
        }) ?? <></>}

        <div className="flex space-x-1 justify-end text-sm mt-3">
          <Button type="button" className="text-sm mt-3" disabled={!isDirty} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
