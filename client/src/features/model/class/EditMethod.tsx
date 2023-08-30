import { type FC, useState } from "react";
import { type Method, type Parameter } from "./models";
import { MethodCard } from "./MethodCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Checkbox } from "../../../components/checkbox";
import { EditParameters } from "./EditParameters";
import { useTypesContext } from "./TypesContext";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";

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

  if (preview)
    return (
      <div className="py-2">
        <MethodCard method={method} onEdit={() => setPreview(false)} />
      </div>
    );

  const isIdentifier = IDENTIFIER_REGEX.test(method.name);
  const hasUniqueName = !nameExists(method.name);

  const isValid = isIdentifier && hasUniqueName;

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
    <div className="flex flex-col mt-5 shadow-m">
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

      <EditParameters
        parameters={parameters}
        onParameterChange={handleUpdateParameter}
        onAddParameter={handleAddParameter}
        onDeleteParameter={handleDeleteParameter}
        types={types.filter((type: any) => type.label !== "void")}
      />

      <div className="flex justify-between mt-5">
        <div className="flex gap-x-2">
          <button
            disabled={!isValid}
            className={!isValid && "text-gray-600"}
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
        <button
          type="button"
          onClick={() => {
            setPreview(true);
            onDelete(method.id);
          }}
          className="text-red-500 p-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
