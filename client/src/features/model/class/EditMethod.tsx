import { type FC, useState, useCallback } from "react";
import { type Method, type Parameter } from "./models";
import { MethodCard } from "./MethodCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Checkbox } from "../../../components/checkbox";
import { EditParameters } from "./EditParameters";
import { useTypesContext } from "./TypesContext";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { RoundCard } from "../common/components/RoundCard";

type EditMethodProps = {
  method: Method;
  onSave: (method: Method) => any;
  onDelete: (id: string) => any;
  nameExists: (name: string) => boolean;
};

export const EditMethod: FC<EditMethodProps> = ({
  method: initialMethod,
  onSave,
  onDelete,
  nameExists,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { typesWithVoid: types } = useTypesContext(microserviceId);

  const [preview, setPreview] = useState(true);
  const [method, setMethod] = useState(initialMethod);
  const [parameters, setParameters] = useState(initialMethod.parameters);

  const hasDuplicateParamName = useCallback(() => {
    return new Set(parameters.map((p) => p.name)).size !== parameters.length;
  }, [parameters]);

  const areIdentifiers = useCallback(() => {
    return parameters.every((parameter) => IDENTIFIER_REGEX.test(parameter.name));
  }, [parameters]);

  if (preview)
    return (
      <RoundCard className="py-2">
        <MethodCard
          method={method}
          onEdit={() => setPreview(false)}
          onDelete={() => {
            setPreview(true);
            onDelete(method.id);
          }}
        />
      </RoundCard>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(method.name);
  const hasUniqueName = !nameExists(method.name);

  const isValid = isIdentifier && hasUniqueName && !hasDuplicateParamName() && areIdentifiers();

  const handleAddParameter = () => {
    const newParameter = {
      name: "",
      type: "int",
      isCollection: false,
      isOptional: false,
    };
    const newParameters = [...parameters, newParameter];
    setParameters(newParameters);
    setMethod((prevMethod) => ({
      ...prevMethod,
      parameters: newParameters,
    }));
  };

  const handleUpdateParameter = (index: number, updatedParam: Parameter) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = updatedParam;
    setParameters(updatedParameters);
    setMethod((prevMethod) => ({
      ...prevMethod,
      parameters: updatedParameters,
    }));
  };

  const handleDeleteParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
    setMethod((prevMethod) => ({
      ...prevMethod,
      parameters: updatedParameters,
    }));
  };

  return (
    <RoundCard className="py-2">
      <div className="flex">
        <div className="mr-4">
          <TextField
            value={method.name}
            onChange={(name) => {
              setMethod((prevMethod) => ({
                ...prevMethod,
                name,
              }));
            }}
            label="Method Name"
            error={
              (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
            }
          />
        </div>
        <div>
          <Select
            value={method.returnValue}
            onChange={(type) => {
              setMethod((prevMethod) => ({
                ...prevMethod,
                returnValue: type,
                isCollection: false,
              }));
            }}
            options={types}
            label="Return value"
          />
        </div>
      </div>
      {method.returnValue !== "void" && (
        <div className="mt-4">
          <Checkbox
            checked={method.returnsCollection}
            label="Returns collection"
            onChange={(collection) => {
              setMethod((prevMethod) => ({
                ...prevMethod,
                returnsCollection: collection,
              }));
            }}
          />
        </div>
      )}
      {method.returnValue !== "void" && (
        <div className="mt-4">
          <Checkbox
            checked={method.isOptional}
            label="Is optional"
            onChange={(optional) => {
              setMethod((prevMethod) => ({
                ...prevMethod,
                isOptional: optional,
              }));
            }}
          />
        </div>
      )}

      <EditParameters
        parameters={parameters}
        onParameterChange={handleUpdateParameter}
        onAddParameter={handleAddParameter}
        onDeleteParameter={handleDeleteParameter}
        types={types.filter((type: any) => type.label !== "void")}
      />

      <div className="flex justify-end space-x-2 mt-5">
        <button
          disabled={!isValid}
          className={!isValid ? "text-gray-600" : ""}
          onClick={() => {
            setPreview(true);
            onSave({
              ...method,
            });
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setPreview(true);
            setMethod(method);
          }}
        >
          Cancel
        </button>
      </div>
    </RoundCard>
  );
};
