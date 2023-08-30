import { type FC, useState } from "react";
import type { Service, Communication } from "./models";
import { Checkbox } from "../../../components/checkbox";
import { Button } from "../../../components/button";

type CommunicationDrawerProps = {
  communication: Communication;
  possibleServices: Service[];
  onCommunicationUpdate: (communication: Communication) => any;
  onCommunicationDelete: () => any;
};

export const CommunicationDrawer: FC<CommunicationDrawerProps> = ({
  communication,
  possibleServices,
  onCommunicationUpdate,
  onCommunicationDelete,
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

  const handleDelete = onCommunicationDelete;

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
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
};
