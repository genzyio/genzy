import { type FC } from "react";
import { type Attribute } from "./models";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";

type AttributePreview = {
  className?: string;
  attribute: Attribute;
};

export const AttributePreview: FC<AttributePreview> = ({ className = "", attribute }) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

  return (
    <div className={className}>
      {attribute.name}
      {attribute.isOptional ? "?" : ""}: {getTypeLabel(attribute.type)}
      {attribute.isCollection ? "[]" : ""}
    </div>
  );
};
