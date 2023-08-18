import { type FC } from "react";
import { type ServiceType, type ServiceFunction } from "./models";
import { useToggle } from "../../../hooks/useToggle";
import { MethodChip } from "./MethodChip";

type FunctionCardProps = {
  function: ServiceFunction;
  serviceType: ServiceType;
  onEdit?: () => void;
};

export const FunctionCard: FC<FunctionCardProps> = ({ function: fun, serviceType, onEdit }) => {
  const [show, toggleShow] = useToggle();

  const showRoute = serviceType !== "LOCAL";

  return (
    <div className="border p-2">
      <div key={fun.id} className="flex items-center w-full cursor-pointer" onClick={toggleShow}>
        <span className="w-1/6 mr-3">{showRoute && <MethodChip method={fun.method} />}</span>

        <span className="text-lg w-3/4">{showRoute ? fun.route : fun.name}</span>
        {onEdit && (
          <button onClick={onEdit} className="w-1/12">
            Edit
          </button>
        )}
      </div>

      {show && (
        <>
          <div>{showRoute && "Name: " + fun.name}</div>
          {fun.params.length > 0 && "Parameters:"}
          <ul className="ml-4">
            {fun.params.map((param) => (
              <li key={param.id} className="flex items-center w-full">
                <span className="font-semibold">{param.name}</span>: {param.type}
                {param.isCollection && "[]"}{" "}
                {showRoute && (
                  <span className="text-xs italic text-gray-500">({param.source})</span>
                )}
              </li>
            ))}
          </ul>
          Returns: {fun.returnType || "?"}
        </>
      )}
    </div>
  );
};
