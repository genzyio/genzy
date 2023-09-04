import { type FC, useState } from "react";
import type { Service, Communication } from "./models";
import { Checkbox } from "../../../components/checkbox";
import { Button } from "../../../components/button";

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
  const [selectedServices, setSelectedService] = useState(communication.services);

  const handleCheck = (serviceId: string, checked: boolean) => {
    const newServices = checked
      ? [...selectedServices, serviceId]
      : selectedServices.filter((sId) => sId !== serviceId);
    setSelectedService(newServices);
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
          <Button type="button" className="text-sm mt-3" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
