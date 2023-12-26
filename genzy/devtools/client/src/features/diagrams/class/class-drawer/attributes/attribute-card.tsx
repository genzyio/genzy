import { type FC } from "react";
import { type Attribute } from "../../models";
import { AttributePreview } from "./attribute-preview";
import { OperationalButton } from "../../../common/components/operational-button";

type AttributeCardProps = {
  attribute: Attribute;
  onEdit: () => any;
  onDelete: () => any;
};

export const AttributeCard: FC<AttributeCardProps> = ({ attribute, onEdit, onDelete }) => {
  return (
    <div className="flex items-center w-full">
      <AttributePreview className="font-thin flex-1" attribute={attribute} />
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
