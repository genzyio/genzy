import { useState, type FC } from "react";
import { Attribute, Class, DataType, Method, Parameter } from "./models";
import { useSequenceGenerator } from "../../../core/hooks/useStringSequence";
import { TextField } from "../../../core/components/text-field";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { Button } from "../../../core/components/button";
import { EditAttribute } from "./EditAttribute";
import { EditMethod } from "./EditMethod";
import { useValidationContext } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";

type ClassDrawerProps = {
  classId: string;
  class: Class;
  onClassUpdate: (classObject: Class) => any;
  nameExists: (name: string) => boolean;
};

export const ClassDrawer: FC<ClassDrawerProps> = ({
  classId,
  class: initialClass,
  onClassUpdate,
  nameExists,
}) => {
  const { isDirty, setCurrentState } = useDirtyCheckContext();
  const { isValid, setValidityFor } = useValidationContext();

  const [className, setClassName] = useState(initialClass.name);
  const [attributes, setAttributes] = useState([...initialClass.attributes]);
  const [methods, setMethods] = useState([...initialClass.methods]);

  const handleClassNameUpdate = (newClassName: string) => {
    setClassName(newClassName);
    setCurrentState((state: any) => ({
      ...state,
      name: newClassName,
    }));
  };

  const nextAttributeName = useSequenceGenerator(
    attributes,
    (attribute) => attribute.name,
    "attribute"
  );

  const nextMethodName = useSequenceGenerator(methods, (method) => method.name, "method");

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
    setCurrentState((state: any) => ({
      ...state,
      attributes: newAttributes,
    }));
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
    setCurrentState((state: any) => ({
      ...state,
      attributes: newAttributes,
    }));
  };

  const handleDeleteAttribute = (id: string) => {
    const updatedAttributes = attributes.filter((a) => a.id !== id);
    setAttributes(updatedAttributes);
    setCurrentState((state: any) => ({
      ...state,
      attributes: updatedAttributes,
    }));
  };

  const handleAddMethod = () => {
    const newMethod = {
      id: `${+new Date()}`,
      name: nextMethodName(),
      parameters: [] as Parameter[],
      returnValue: "any",
    } as Method;

    const newMethods = [...methods, newMethod];
    setMethods(newMethods);
    setCurrentState((state: any) => ({
      ...state,
      methods: newMethods,
    }));
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
    setCurrentState((state: any) => ({
      ...state,
      methods: newMethods,
    }));
  };

  const handleDeleteMethod = (id: string) => {
    const updatedMethods = methods.filter((m) => m.id !== id);
    setMethods(updatedMethods);
    setCurrentState((state: any) => ({
      ...state,
      methods: updatedMethods,
    }));
  };

  const handleSave = () => {
    onClassUpdate({
      microserviceId: initialClass.microserviceId,
      name: className,
      attributes,
      methods,
    });
  };

  const isIdentifier = IDENTIFIER_REGEX.test(className);
  const hasUniqueName = !nameExists(className);

  const isValidClass = isIdentifier && hasUniqueName;
  setValidityFor(classId, isValidClass);

  return (
    <>
      <div className="mx-4">
        <div className="flex mb-5 w-full">
          <TextField
            value={className}
            onChange={handleClassNameUpdate}
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
        </div>

        {!!attributes?.length && <p>Attributes</p>}
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
        {methods.length > 0 && <hr className="my-3" />}
        {!!methods?.length && <p>Methods</p>}

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
            <Button
              type="button"
              className="text-sm mt-3"
              disabled={!isValid || !isDirty}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
