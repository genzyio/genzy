import { type FC } from "react";
import { type Attribute } from "./models";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";

type AttributeCardProps = {
  attribute: Attribute;
  onEdit: () => any;
};

export const AttributeCard: FC<AttributeCardProps> = ({ attribute, onEdit }) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-2">
      <div key={attribute.id} className="flex items-center w-full">
        <div className="text-gray-500 font-thin flex-1">
          {attribute.name}
          {attribute.isOptional ? "?" : <></>} : {getTypeLabel(attribute.type)}
          {attribute.isCollection ? "[]" : <></>}
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
