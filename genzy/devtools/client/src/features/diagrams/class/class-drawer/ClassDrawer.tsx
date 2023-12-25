import { type FC } from "react";
import { type Class, type Attribute, type Method } from "../models";
import { useSequenceGenerator } from "../../../../core/hooks/useStringSequence";
import { TextField } from "../../../../core/components/text-field";
import { IDENTIFIER_REGEX } from "../../../../patterns";
import { Button } from "../../../../core/components/button";
import { EditAttribute } from "./attributes/EditAttribute";
import { EditMethod } from "./methods/EditMethod";
import { useValidationContext } from "../../common/contexts/validation-context";
import { useDirtyCheckContext } from "../../common/contexts/dirty-check-context";
import { useClassState } from "./class-state";
import { VerticallyFlippable } from "../../../../core/components/wrappers/flippable";
import { createFunctionalComponent } from "../../../../core/utils/components";

const FunctionalEditAttribute = createFunctionalComponent(EditAttribute);
const FunctionalEditMethod = createFunctionalComponent(EditMethod);

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
  const { isDirty } = useDirtyCheckContext();
  const { isValid, setValidityFor } = useValidationContext();

  const { class: _class, actions } = useClassState(initialClass);
  const className = _class.name;
  const attributes = _class.attributes;
  const methods = _class.methods;

  const handleClassNameUpdate = (newClassName: string) => {
    actions.updateClassData({ name: newClassName });
  };

  const nextAttributeName = useSequenceGenerator(
    attributes,
    (attribute) => attribute.name,
    "attribute"
  );
  const nextMethodName = useSequenceGenerator(methods, (method) => method.name, "method");

  const handleAddAttribute = () => {
    actions.addAttribute({ attributeName: nextAttributeName() });
  };

  const handleUpdateAttribute = (updatedAttribute: Attribute) => {
    actions.updateAttribute(updatedAttribute);
  };

  const handleDeleteAttribute = (id: string) => {
    actions.deleteAttribute({ id });
  };

  const handleAddMethod = () => {
    actions.addMethod({ methodName: nextMethodName() });
  };

  const handleUpdateMethod = (updatedMethod: Method) => {
    actions.updateMethod(updatedMethod);
  };

  const handleDeleteMethod = (id: string) => {
    actions.deleteMethod({ id });
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
        <div className="flex w-full mb-5">
          <div className="flex-1">
            <TextField
              label="Name"
              value={className}
              onChange={handleClassNameUpdate}
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>
        </div>

        {!!attributes?.length && <p>Attributes</p>}
        <VerticallyFlippable>
          {attributes.map((attribute, index) => (
            <FunctionalEditAttribute
              key={attribute.id}
              attribute={attribute}
              onChange={(updatedAttribute) => {
                handleUpdateAttribute({ id: attribute.id, ...updatedAttribute });
              }}
              onDelete={(id) => {
                handleDeleteAttribute(id);
              }}
              nameExists={(newAttrName) =>
                attributes.some((attribute, i) => i !== index && attribute.name === newAttrName)
              }
            />
          ))}
        </VerticallyFlippable>

        {attributes.length > 0 && methods.length > 0 && <hr className="my-3" />}
        {!!methods?.length && <p>Methods</p>}

        <VerticallyFlippable>
          {methods.map((method, index) => (
            <FunctionalEditMethod
              key={method.id}
              method={method}
              onChange={(updatedMethod) => {
                handleUpdateMethod({ id: method.id, ...updatedMethod });
              }}
              onDelete={(id) => {
                handleDeleteMethod(id);
              }}
              nameExists={(newAttrName) =>
                methods.some((method, i) => i !== index && method.name === newAttrName)
              }
            />
          ))}
        </VerticallyFlippable>
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
