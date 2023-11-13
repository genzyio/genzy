import { type FC, useState, useCallback } from "react";
import { type DataType, type Method, type Parameter } from "./models";
import { MethodCard } from "./MethodCard";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { TextField } from "../../../core/components/text-field";
import { Select } from "../../../core/components/select";
import { Checkbox } from "../../../core/components/checkbox";
import { EditParameters } from "./EditParameters";
import { useTypesContext } from "./TypesContext";
import { useMicroserviceContext } from "../common/contexts/microservice.context";
import { RoundCard } from "../common/components/RoundCard";
import { useSequenceGenerator } from "../../../core/hooks/useStringSequence";
import { ClosableWrapper } from "../common/components/ClosableWrapper";
import { useValidationContext } from "../common/contexts/validation-context";
import cloneDeep from "lodash.clonedeep";

type EditMethodProps = {
  method: Method;
  onChange: (method: Method) => any;
  onDelete: (id: string) => any;
  nameExists: (name: string) => boolean;
};

export const EditMethod: FC<EditMethodProps> = ({ method, onChange, onDelete, nameExists }) => {
  const { microserviceId } = useMicroserviceContext();
  const { types } = useTypesContext(microserviceId);
  const { setValidityFor } = useValidationContext();

  const [preview, setPreview] = useState(true);
  const [initialMethod, setInitialMethod] = useState(cloneDeep(method));
  const [parameters, setParameters] = useState(cloneDeep(method.parameters));

  const changeMethodName = (name: string) => onChange({ ...method, name });
  const changeReturnValue = (returnValue: DataType) => onChange({ ...method, returnValue });
  const changeIsOptional = (isOptional: boolean) => onChange({ ...method, isOptional });
  const changeReturnsCollection = (returnsCollection: boolean) =>
    onChange({ ...method, returnsCollection });

  const nextParamName = useSequenceGenerator(parameters, (param) => param.name, "param");

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

  const isValidMethod =
    isIdentifier && hasUniqueName && !hasDuplicateParamName() && areIdentifiers();
  setValidityFor(method.id, isValidMethod);

  const handleAddParameter = () => {
    const newParameter = {
      name: nextParamName(),
      type: "int",
      isCollection: false,
      isOptional: false,
    };
    const newParameters = [...parameters, newParameter];
    setParameters(newParameters);
    onChange({ ...method, parameters: newParameters });
  };

  const handleUpdateParameter = (index: number, updatedParam: Parameter) => {
    const updatedParameters = [...parameters];
    updatedParameters[index] = updatedParam;
    setParameters(updatedParameters);
    onChange({ ...method, parameters: updatedParameters });
  };

  const handleDeleteParameter = (index: number) => {
    const updatedParameters = [...parameters];
    updatedParameters.splice(index, 1);
    setParameters(updatedParameters);
    onChange({ ...method, parameters: updatedParameters });
  };

  return (
    <RoundCard className="py-2">
      <ClosableWrapper
        hidden={!isValidMethod}
        onClick={() => {
          setPreview(true);
          setInitialMethod(cloneDeep(method));
        }}
      >
        <div className="flex space-x-2">
          <div className="flex-1">
            <TextField
              value={method.name}
              onChange={changeMethodName}
              label="Method Name"
              error={
                (!isIdentifier && "Must be an identifier") || (!hasUniqueName && "Already exists")
              }
            />
          </div>
          <div className="min-w-[30%]">
            <Select
              value={method.returnValue}
              onChange={changeReturnValue}
              options={types}
              label="Returns"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-3 items-center">
          <label className="font-medium leading-6">Return options:</label>
          <Checkbox
            label="Array"
            checked={method.returnsCollection}
            onChange={changeReturnsCollection}
          />
          <Checkbox label="Optional" checked={method.isOptional} onChange={changeIsOptional} />
        </div>

        <EditParameters
          parameters={parameters}
          onParameterChange={handleUpdateParameter}
          onDeleteParameter={handleDeleteParameter}
          types={types}
        />

        <div className="flex justify-between mt-5">
          <button onClick={handleAddParameter} className="mt-2 hover:text-gray-400">
            Add Parameter
          </button>

          <button
            className="hover:text-gray-400"
            onClick={() => {
              setPreview(true);
              setValidityFor(method.id, true);
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
