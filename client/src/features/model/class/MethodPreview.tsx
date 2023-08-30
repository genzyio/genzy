import { type FC } from "react";
import { type Method, type Parameter } from "./models";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";

type MethodPreviewProps = {
  className?: string;
  method: Method;
};

function formParameter(parameter: Parameter, getTypeLabel: (type: string) => string) {
  const namePart = parameter.name + (parameter.isOptional ? "?" : "");
  const typePart = getTypeLabel(parameter.type) + (parameter.isCollection ? "[]" : "");

  return namePart + ": " + typePart;
}

function formReturnType(method: Method, getTypeLabel: (type: string) => string) {
  const typeLabel = getTypeLabel(method.returnValue);
  const collectionPart = method.returnsCollection ? "[]" : "";
  const optionalPart = method.isOptional ? " | undefined" : "";

  return typeLabel + collectionPart + optionalPart;
}

export const MethodPreview: FC<MethodPreviewProps> = ({ className = "", method }) => {
  const { microserviceId } = useMicroserviceContext();
  const { getTypeLabel } = useTypesContext(microserviceId);

  return (
    <div className={className}>
      {method.name}
      {"(" + method.parameters.map((p) => formParameter(p, getTypeLabel)).join(", ") + ")"}
      {": " + formReturnType(method, getTypeLabel)}
    </div>
  );
};
