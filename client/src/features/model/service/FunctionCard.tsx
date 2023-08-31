import { type FC } from "react";
import { type ServiceType, type ServiceFunction } from "./models";
import { useToggle } from "../../../hooks/useToggle";
import { MethodChip } from "./MethodChip";
import { useTypesContext } from "../class/TypesContext";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { OperationalButton } from "../common/components/OperationalButton";

type FunctionCardProps = {
  function: ServiceFunction;
  serviceType: ServiceType;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const FunctionCard: FC<FunctionCardProps> = ({
  function: fun,
  serviceType,
  onEdit,
  onDelete,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

  const [show, toggleShow] = useToggle();

  const showRoute = serviceType !== "LOCAL";

  return (
    <div className="flex items-center w-full cursor-pointer" onClick={toggleShow}>
      <div className="flex flex-1">
        <span className="w-1/6 mr-3">{showRoute && <MethodChip method={fun.method} />}</span>
        <span className="text-lg">{showRoute ? fun.route : fun.name}</span>
      </div>
      <div className="space-x-1">
        {onEdit && (
          <OperationalButton color="indigo-700" border="left" onClick={onEdit}>
            Edit
          </OperationalButton>
        )}
        {onDelete && (
          <OperationalButton color="red-500" border="right" onClick={onDelete}>
            Delete
          </OperationalButton>
        )}
      </div>

      {show && (
        <>
          <div>{showRoute && "Name: " + fun.name}</div>
          {fun.params.length > 0 && "Parameters:"}
          <ul className="ml-4">
            {fun.params.map((param) => (
              <li key={param.id} className="flex items-center w-full">
                <span className="font-semibold">{param.name}</span>: {getTypeLabel(param.type)}
                {param.isCollection && "[]"}{" "}
                {showRoute && (
                  <span className="text-xs italic text-gray-500">({param.source})</span>
                )}
              </li>
            ))}
          </ul>
          Returns: {getTypeLabel(fun.returnType) || "?"}
        </>
      )}
    </div>
  );
};
