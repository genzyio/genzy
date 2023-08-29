import { FC } from "react";
import { Attribute } from "./models";

type AttributeCardProps = {
  attribute: Attribute;
  types: any;
  onEdit: () => any;
};

export const AttributeCard: FC<AttributeCardProps> = ({ attribute, onEdit, types }) => {
  const typeName = (typeValue: string) => {
    const foundType = types.find((type) => type.value === typeValue);
    if (foundType) {
      return foundType.label;
    }
    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-2">
      <div key={attribute.id} className="flex items-center w-full">
        <div className="text-gray-500 font-thin flex-1">
          {attribute.name}
          {attribute.isOptional ? "?" : <></>} : {typeName(attribute.type)}
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
