import { type FC, useState } from "react";
import { type Attribute, type DataType } from "../../models";
import { AttributeCard } from "./attribute-card";
import { IDENTIFIER_REGEX } from "../../../../../patterns";
import { TextField } from "@core/components/text-field";
import { Select } from "@core/components/select";
import { Checkbox } from "@core/components/checkbox";
import { useMicroserviceContext } from "../../../common/contexts/microservice.context";
import { useTypesContext } from "../../types.context";
import { RoundCard } from "../../../common/components/round-card";
import { ClosableWrapper } from "../../../common/components/closable-wrapper";
import { useValidationContext } from "../../../common/contexts/validation.context";
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
  const { setValidityFor } = useValidationContext();

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

  const isValidAttribute = isIdentifier && hasUniqueName;
  setValidityFor(attribute.id, isValidAttribute);

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValidAttribute}
        onClick={() => {
          setPreview(true);
          setInitialAttribute(cloneDeep(attribute));
        }}
      >
        <div className="flex space-x-2">
          <div className="flex-1">
            <TextField
              label="Attribute Name"
              value={attribute.name}
              onChange={changeAttributeName}
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>
          <div className="min-w-[30%]">
            <Select
              label="Attribute Type"
              value={attribute.type}
              onChange={changeAttributeType}
              options={types}
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-3 items-center">
          <label className="font-medium leading-6">Attribute options:</label>
          <Checkbox label="Array" checked={attribute.isCollection} onChange={changeIsCollection} />
          <Checkbox label="Optional" checked={attribute.isOptional} onChange={changeIsOptional} />
        </div>

        <div className="flex justify-end">
          <button
            className="hover:text-gray-400"
            onClick={() => {
              setPreview(true);
              setValidityFor(attribute.id, true);
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
