import { type FC, useState } from "react";
import { type Attribute, type DataType } from "./models";
import { AttributeCard } from "./AttributeCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Checkbox } from "../../../components/checkbox";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";

type EditAttributeProps = {
  attribute: Attribute;
  onSave: (attribute: Attribute) => any;
  onDelete: (id: string) => any;
  nameExists: (name: string) => boolean;
};

export const EditAttribute: FC<EditAttributeProps> = ({
  attribute: initialAttribute,
  onSave,
  onDelete,
  nameExists,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { types } = useTypesContext(microserviceId);

  const [preview, setPreview] = useState(true);
  const [attribute, setAttribute] = useState(initialAttribute);

  if (preview)
    return (
      <div className="py-2">
        <AttributeCard attribute={attribute} onEdit={() => setPreview(false)} />
      </div>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(attribute.name);
  const hasUniqueName = !nameExists(attribute.name);

  const isValid = isIdentifier && hasUniqueName;

  return (
    <div className="flex flex-col mt-5 shadow-sm">
      <div className="flex">
        <div className="mr-4">
          <TextField
            value={attribute.name}
            onChange={(name) => {
              setAttribute((prevAttribute) => ({
                ...prevAttribute,
                name,
              }));
            }}
            label="Attribute Name"
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
        </div>
        <div>
          <Select
            value={attribute.type}
            onChange={(type) => {
              setAttribute((prevAttribute) => ({
                ...prevAttribute,
                type: type as DataType,
              }));
            }}
            options={types}
            label="Attribute Type"
          />
        </div>
      </div>
      <div className="mt-4">
        <Checkbox
          checked={attribute.isOptional}
          label="Optional"
          onChange={(optional) => {
            setAttribute((prevAttribute) => ({
              ...prevAttribute,
              isOptional: optional,
            }));
          }}
        />
      </div>
      <div className="mt-4">
        <Checkbox
          checked={attribute.isCollection}
          label="Collection"
          onChange={(collection) => {
            setAttribute((prevAttribute) => ({
              ...prevAttribute,
              isCollection: collection,
            }));
          }}
        />
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex gap-x-2">
          <button
            disabled={!isValid}
            className={!isValid && "text-gray-600"}
            onClick={() => {
              setPreview(true);
              onSave(attribute);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setPreview(true);
              setAttribute(initialAttribute);
            }}
          >
            Cancel
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setPreview(true);
            onDelete(attribute.id);
          }}
          className="text-red-500 p-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
