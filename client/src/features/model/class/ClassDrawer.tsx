import { useState, type FC } from "react";
import { Attribute, Class, DataType, Method, Parameter } from "./models";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { TextField } from "../../../components/text-field";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { Button } from "../../../components/button";
import { EditAttribute } from "./EditAttribute";
import { EditMethod } from "./EditMethod";

type ClassDrawerProps = {
  class: Class;
  onClassUpdate: (classObject: Class) => any;
  nameExists: (name: string) => boolean;
};

export const ClassDrawer: FC<ClassDrawerProps> = ({
  class: initialClass,
  onClassUpdate,
  nameExists,
}) => {
  const [className, setClassName] = useState(initialClass.name);
  const [attributes, setAttributes] = useState([...initialClass.attributes]);
  const [methods, setMethods] = useState([...initialClass.methods]);

  const nextAttributeName = useSequenceGenerator(
    attributes,
    (attribute) => attribute.name,
    "Attribute"
  );

  const nextMethodName = useSequenceGenerator(methods, (method) => method.name, "Method");

  const handleAddAttribute = () => {
    const newAttribute = {
      id: `${+new Date()}`,
      name: nextAttributeName(),
      type: "int" as DataType,
      isCollection: false,
      isOptional: false,
    };
    const newAttributes = [...attributes, newAttribute];
    setAttributes(newAttributes);
  };

  const handleUpdateAttribute = (id: string, attribute: Attribute) => {
    const newAttributes = attributes.map((attr) => {
      if (attr.id === id)
        return {
          ...attribute,
        };
      return attr;
    });
    setAttributes(newAttributes);
  };

  const handleDeleteAttribute = (id: string) => {
    const updatedAttributes = attributes.filter((a) => a.id !== id);
    setAttributes(updatedAttributes);
  };

  const handleAddMethod = () => {
    const newMethod = {
      id: `${+new Date()}`,
      name: nextMethodName(),
      parameters: [] as Parameter[],
      returnValue: "void",
    } as Method;

    const newMethods = [...methods, newMethod];
    setMethods(newMethods);
  };

  const handleUpdateMethod = (id: string, method: Method) => {
    const newMethods = methods.map((m) => {
      if (m.id === id)
        return {
          ...method,
        };
      return m;
    });
    setMethods(newMethods);
  };

  const handleDeleteMethod = (id: string) => {
    const updatedMethods = methods.filter((m) => m.id !== id);
    setMethods(updatedMethods);
  };

  const handleSave = () => {
    onClassUpdate({
      microserviceId: initialClass.microserviceId,
      name: className,
      attributes,
      methods,
    });
  };

  return (
    <>
      <div className="mx-4">
        <div className="flex mb-5 w-full">
          <TextField
            value={className}
            onChange={setClassName}
            error={
              (!IDENTIFIER_REGEX.test(className) && "Must be an identifier") ||
              (nameExists(className) && "AlreadyExists")
            }
          />
        </div>
        {attributes.map((attribute, index) => (
          <EditAttribute
            key={attribute.id}
            attribute={attribute}
            onChange={(attribute) => {
              handleUpdateAttribute(attribute.id, attribute);
            }}
            onDelete={(id) => {
              handleDeleteAttribute(id);
            }}
            nameExists={(newAttrName) =>
              attributes.some((attribute, i) => i !== index && attribute.name === newAttrName)
            }
          />
        ))}
        {methods.length > 0 && <hr />}
        {methods.map((method, index) => (
          <EditMethod
            key={method.id}
            method={method}
            onChange={(method) => {
              handleUpdateMethod(method.id, method);
            }}
            onDelete={(id) => {
              handleDeleteMethod(id);
            }}
            nameExists={(newAttrName) =>
              methods.some((method, i) => i !== index && method.name === newAttrName)
            }
          />
        ))}
        <div className="flex text-sm mt-3 space-x-3">
          <div className="flex-1 space-x-1">
            <Button type="button" className="text-sm mt-3" onClick={handleAddAttribute}>
              New attribute
            </Button>
            <Button type="button" className="text-sm mt-3" onClick={handleAddMethod}>
              New method
            </Button>
          </div>

          <div className="space-x-1">
            <Button type="button" className="text-sm mt-3" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
