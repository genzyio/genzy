import { type FC } from "react";
import { type Attribute } from "./models";
import { AttributePreview } from "./AttributePreview";

type AttributeCardProps = {
  attribute: Attribute;
  onEdit: () => any;
};

export const AttributeCard: FC<AttributeCardProps> = ({ attribute, onEdit }) => {
  return (
    <div key={attribute.id} className="border border-gray-200 rounded-lg shadow-sm p-2">
      <div className="flex items-center w-full">
        <AttributePreview className="text-gray-500 font-thin flex-1" attribute={attribute} />
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
