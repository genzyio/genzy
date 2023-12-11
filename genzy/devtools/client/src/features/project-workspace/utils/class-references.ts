import { type Class } from "../../diagrams/class/models";
import { primitiveTypes } from "../../diagrams/class/TypesContext";

function extractComplexTypes(_class: Class) {
  const complexTypes = _class.attributes
    .filter((attribute) => !primitiveTypes.includes(attribute.type))
    .map((attribute) => attribute.type);

  return complexTypes.filter((complexType, i, filtered) => filtered.indexOf(complexType) === i);
}

export { extractComplexTypes };
