import { FC } from "react";
import { Method } from "./models";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";

type MethodCardProps = {
  method: Method;
  onEdit: () => any;
};

export const MethodCard: FC<MethodCardProps> = ({ method, onEdit }) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

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
                getTypeLabel(p.type) +
                (p.isCollection ? "[]" : "")
            )
            .join(", ")}
          {")"}: {getTypeLabel(method.returnValue)}
          {method.returnsCollection ? "[]" : ""}
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
