import { type FC } from "react";

type ServiceCardProps = {
  serviceName: string;
  onEdit: () => any;
};

export const ServiceCardCard: FC<ServiceCardProps> = ({ serviceName, onEdit }) => {
  return (
    <div className="border p-2">
      <div key={serviceName} className="flex items-center w-full">
        <div className="text-lg flex-1">{serviceName}</div>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};
