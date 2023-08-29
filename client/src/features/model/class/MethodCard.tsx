import { FC } from "react";
import { Method } from "./models";

type MethodCardProps = {
  method: Method;
  types: any;
  onEdit: () => any;
};

export const MethodCard: FC<MethodCardProps> = ({ method, types, onEdit }) => {
  const typeName = (typeValue: string) => {
    const foundType = types.find((type: any) => type.value === typeValue);
    if (foundType) {
      return foundType.label;
    }
    return "void";
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-2">
      <div key={method.id} className="flex items-center w-full">
        <div className="text-gray-500 font-thin flex-1">
          {method.name}
          {"("}
          {method.parameters
            .map(
              (p) =>
                p.name +
                (p.isOptional ? "?" : "") +
                ": " +
                typeName(p.type) +
                (p.isCollection ? "[]" : "")
            )
            .join(", ")}
          {")"}: {typeName(method.returnValue)}
        </div>
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
