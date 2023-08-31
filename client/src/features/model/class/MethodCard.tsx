import { type FC } from "react";
import { type Method } from "./models";
import { MethodPreview } from "./MethodPreview";
import { OperationalButton } from "../common/components/OperationalButton";

type MethodCardProps = {
  method: Method;
  onEdit: () => any;
  onDelete: () => any;
};

export const MethodCard: FC<MethodCardProps> = ({ method, onEdit, onDelete }) => {
  return (
    <div className="flex items-center w-full">
      <MethodPreview className="text-gray-500 font-thin flex-1" method={method} />
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
