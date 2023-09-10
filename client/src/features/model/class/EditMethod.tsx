import { type FC, useState, useCallback } from "react";
import { type DataType, type Method, type Parameter } from "./models";
import { MethodCard } from "./MethodCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Checkbox } from "../../../components/checkbox";
import { EditParameters } from "./EditParameters";
import { useTypesContext } from "./TypesContext";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { RoundCard } from "../common/components/RoundCard";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { ClosableWrapper } from "../common/components/ClosableWrapper";
import cloneDeep from "lodash.clonedeep";

type EditMethodProps = {
  method: Method;
  onChange: (method: Method) => any;
  onDelete: (id: string) => any;
  nameExists: (name: string) => boolean;
};

export const EditMethod: FC<EditMethodProps> = ({ method, onChange, onDelete, nameExists }) => {
  const { microserviceId } = useMicroserviceContext();
  const { typesWithVoid: types } = useTypesContext(microserviceId);

  const [preview, setPreview] = useState(true);
  const [initialMethod, setInitialMethod] = useState(cloneDeep(method));
  const [parameters, setParameters] = useState(method.parameters);

  const changeMethodName = (name: string) => onChange({ ...method, name });
  const changeReturnValue = (returnValue: DataType | "void") =>
    onChange({ ...method, returnValue });
  const changeIsOptional = (isOptional: boolean) => onChange({ ...method, isOptional });
  const changeReturnsCollection = (returnsCollection: boolean) =>
    onChange({ ...method, returnsCollection });

  const nextParamName = useSequenceGenerator(parameters, (param) => param.name, "Param");

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
      name: nextParamName(),
      type: "int",
      isCollection: false,
      isOptional: false,
    };
    const newParameters = [...parameters, newParameter];
    setParameters(newParameters);
    method.parameters = newParameters;
  };

  const handleUpdateParameter = (index: number, updatedParam: Parameter) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = updatedParam;
    setParameters(updatedParameters);
    method.parameters = updatedParameters;
  };

  const handleDeleteParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
    method.parameters = updatedParameters;
  };

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValid}
        onClick={() => {
          setPreview(true);
          setInitialMethod(cloneDeep(method));
        }}
      >
        <div className="flex">
          <div className="mr-4">
            <TextField
              value={method.name}
              onChange={changeMethodName}
              label="Method Name"
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>
          <div>
            <Select
              value={method.returnValue}
              onChange={changeReturnValue}
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
              onChange={changeReturnsCollection}
            />
          </div>
        )}
        {method.returnValue !== "void" && (
          <div className="mt-4">
            <Checkbox checked={method.isOptional} label="Is optional" onChange={changeIsOptional} />
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
            onClick={() => {
              setPreview(true);
              onChange(initialMethod);
              setParameters(initialMethod.parameters);
            }}
          >
            Cancel
          </button>
        </div>
      </ClosableWrapper>
    </RoundCard>
  );
};
