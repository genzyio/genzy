import { type FC } from "react";
import { SERVICE_TYPE_DISPLAY_NAME } from "../service/models";

const colors = {
  CONTROLLER: "bg-red-100 border-red-500",
  LOCAL: "bg-green-100 border-green-300",
} as const;

type ServiceTypeChipProps = {
  type: string;
};

export const ServiceTypeChip: FC<ServiceTypeChipProps> = ({ type }) => {
  return (
    <div className={`border ${colors[type]} rounded-md px-1 py-1.5 text-center text-xs w-17`}>
      {SERVICE_TYPE_DISPLAY_NAME[type]?.split(" ")[0] ?? ""}
    </div>
  );
};
