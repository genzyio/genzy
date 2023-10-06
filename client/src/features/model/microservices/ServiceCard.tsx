import { type FC } from "react";
import { type Service } from "./models";
import { OperationalButton } from "../common/components/OperationalButton";
import { ServiceTypeChip } from "./ServiceTypeChip";

type ServiceCardProps = {
  service: Service;
  onEdit: () => any;
  onDelete: () => any;
};

export const ServiceCardCard: FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  return (
    <div className="flex items-center w-full">
      <div className="mr-2">
        <ServiceTypeChip type={service.type} />
      </div>
      <div className="text-lg flex-1">{service.name}</div>
      <div className="space-x-1">
        <OperationalButton color="indigo-700" border="left" onClick={onEdit}>
          Edit
        </OperationalButton>
        <OperationalButton color="red-500" border="right" onClick={onDelete}>
          Delete
        </OperationalButton>
      </div>
    </div>
  );
};