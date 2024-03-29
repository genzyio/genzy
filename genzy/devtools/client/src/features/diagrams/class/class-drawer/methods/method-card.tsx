import { type FC } from "react";
import { type Method } from "../../models";
import { MethodPreview } from "./method-preview";
import { OperationalButton } from "../../../common/components/operational-button";

type MethodCardProps = {
  method: Method;
  onEdit: () => any;
  onDelete: () => any;
};

export const MethodCard: FC<MethodCardProps> = ({ method, onEdit, onDelete }) => {
  return (
    <div className="flex items-center w-full">
      <MethodPreview className="font-thin flex-1" method={method} />
      <div className="space-x-1">
        <OperationalButton color="gray-300" border="left" onClick={onEdit}>
          Edit
        </OperationalButton>
        <OperationalButton color="red-500" border="right" onClick={onDelete}>
          Delete
        </OperationalButton>
      </div>
    </div>
  );
};
