import { type FC, useState } from "react";
import { type Attribute, type DataType } from "./models";
import { AttributeCard } from "./AttributeCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Checkbox } from "../../../components/checkbox";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "./TypesContext";
import { RoundCard } from "../common/components/RoundCard";
import { ClosableWrapper } from "../common/components/ClosableWrapper";
import cloneDeep from "lodash.clonedeep";

type EditAttributeProps = {
  attribute: Attribute;
  onChange: (attribute: Attribute) => any;
  onDelete: (id: string) => any;
  nameExists: (name: string) => boolean;
};

export const EditAttribute: FC<EditAttributeProps> = ({
  attribute,
  onChange,
  onDelete,
  nameExists,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { types } = useTypesContext(microserviceId);

  const [preview, setPreview] = useState(true);
  const [initialAttribute, setInitialAttribute] = useState(cloneDeep(attribute));

  const changeAttributeName = (name: string) => onChange({ ...attribute, name });
  const changeAttributeType = (type: DataType) => onChange({ ...attribute, type });
  const changeIsOptional = (isOptional: boolean) => onChange({ ...attribute, isOptional });
  const changeIsCollection = (isCollection: boolean) => onChange({ ...attribute, isCollection });

  if (preview)
    return (
      <RoundCard className="py-2">
        <AttributeCard
          attribute={attribute}
          onEdit={() => setPreview(false)}
          onDelete={() => {
            setPreview(true);
            onDelete(attribute.id);
          }}
        />
      </RoundCard>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(attribute.name);
  const hasUniqueName = !nameExists(attribute.name);

  const isValid = isIdentifier && hasUniqueName;

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValid}
        onClick={() => {
          setPreview(true);
          setInitialAttribute(cloneDeep(attribute));
        }}
      >
        <div className="flex">
          <div className="mr-4">
            <TextField
              value={attribute.name}
              onChange={changeAttributeName}
              label="Attribute Name"
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>
          <div>
            <Select
              value={attribute.type}
              onChange={changeAttributeType}
              options={types}
              label="Attribute Type"
            />
          </div>
        </div>
        <div className="mt-4">
          <Checkbox checked={attribute.isOptional} label="Optional" onChange={changeIsOptional} />
        </div>
        <div className="mt-4">
          <Checkbox
            checked={attribute.isCollection}
            label="Collection"
            onChange={changeIsCollection}
          />
        </div>
        <div className="flex justify-end space-x-2 mt-5">
          <button
            onClick={() => {
              setPreview(true);
              onChange(initialAttribute);
            }}
          >
            Cancel
          </button>
        </div>
      </ClosableWrapper>
    </RoundCard>
  );
};
