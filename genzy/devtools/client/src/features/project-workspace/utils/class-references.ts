import { type Class } from "@features/diagrams/class/models";
import { primitiveTypes } from "@features/diagrams/class/types.context";

function extractComplexTypes(_class: Class) {
  const complexTypes = _class.attributes
    .filter((attribute) => !primitiveTypes.includes(attribute.type))
    .map((attribute) => attribute.type);

  return complexTypes.filter((complexType, i, filtered) => filtered.indexOf(complexType) === i);
}

export { extractComplexTypes };
