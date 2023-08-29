import { useState, type FC } from "react";
import { Attribute, Class, DataType, Method, Parameter } from "./models";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { TextField } from "../../../components/text-field";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { Button } from "../../../components/button";
import { EditAttribute } from "./EditAttribute";
import { EditMethod } from "./EditMethod";
//Mozda bolje u context types
type ClassDrawerProps = {
  class: Class;
  onClassUpdate: (classObject: Class) => any;
  nameExists: (name: string) => boolean;
  types: any;
};

export const ClassDrawer: FC<ClassDrawerProps> = ({
  class: initialClass,
  onClassUpdate,
  nameExists,
  types,
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

  const handleSave = () => {
    onClassUpdate({ name: className, attributes, methods });
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
            onSave={(attribute) => {
              handleUpdateAttribute(attribute.id, attribute);
            }}
            onDelete={() => {}}
            nameExists={(newAttrName) =>
              attributes.some((attribute, i) => i !== index && attribute.name === newAttrName)
            }
            types={types}
          />
        ))}
        {methods.map((method, index) => (
          <>
            <hr />
            <EditMethod
              key={method.id}
              method={method}
              onSave={(method) => {
                handleUpdateMethod(method.id, method);
              }}
              onDelete={() => {}}
              nameExists={(newAttrName) =>
                methods.some((method, i) => i !== index && method.name === newAttrName)
              }
              types={[...types, { label: "void", value: "void" }]}
            />
          </>
        ))}
        <div className="flex">
          <Button type="button" onClick={handleAddAttribute} className="text-sm mt-3 mr-1">
            New attribute
          </Button>
          <Button type="button" onClick={handleAddMethod} className="text-sm mt-3 mr-3">
            New method
          </Button>
          <Button type="button" onClick={handleSave} className="text-sm mt-3 justify-end">
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
