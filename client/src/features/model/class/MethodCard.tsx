import { type FC } from "react";
import { type Method } from "./models";
import { MethodPreview } from "./MethodPreview";

type MethodCardProps = {
  method: Method;
  onEdit: () => any;
};

export const MethodCard: FC<MethodCardProps> = ({ method, onEdit }) => {
  return (
    <div key={method.id} className="border border-gray-200 rounded-lg shadow-sm p-2">
      <div className="flex items-center w-full">
        <MethodPreview className="text-gray-500 font-thin flex-1" method={method} />
        <button
          type="button"
          className="text-indigo-700 border border-indigo-700 rounded-lg text-xs px-2 py-1.5 text-center"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};
