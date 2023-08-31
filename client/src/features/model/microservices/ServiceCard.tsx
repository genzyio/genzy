import { type FC } from "react";
import { OperationalButton } from "../common/components/OperationalButton";

type ServiceCardProps = {
  serviceName: string;
  onEdit: () => any;
  onDelete: () => any;
};

export const ServiceCardCard: FC<ServiceCardProps> = ({ serviceName, onEdit, onDelete }) => {
  return (
    <div className="flex items-center w-full">
      <div className="text-lg flex-1">{serviceName}</div>
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
