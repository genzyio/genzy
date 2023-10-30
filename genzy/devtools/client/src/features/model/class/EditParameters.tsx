import { useCallback, type FC } from "react";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Parameter } from "./models";
import { Checkbox } from "../../../components/checkbox";
import { IDENTIFIER_REGEX } from "../../../patterns";
import { capitalizeFirstLetter, stringifyNumber } from "../../../utils/string";

type EditParametersProps = {
  parameters: Parameter[];
  onParameterChange: (index: number, {}) => any;
  onDeleteParameter: (index: number) => any;
  types: any;
};

export const EditParameters: FC<EditParametersProps> = ({
  parameters,
  onParameterChange,
  onDeleteParameter,
  types,
}) => {
  const isIdentifier = useCallback((paramName: string) => {
    return IDENTIFIER_REGEX.test(paramName);
  }, []);

  const hasUniqueName = useCallback(
    (paramName: string) => {
      return parameters.filter((p) => p.name === paramName).length === 1;
    },
    [parameters]
  );

  return (
    <div>
      {parameters.map((param, index) => (
        <div key={index} className="flex flex-col mb-2 mt-4 p-3 shadow-md">
          <div className="flex space-x-2">
            <div className="flex-1">
              <TextField
                label={`${capitalizeFirstLetter(stringifyNumber(index + 1))} param name`}
                value={param.name}
                onChange={(name) => onParameterChange(index, { ...param, name })}
                error={
                  (!isIdentifier(param.name) && "Must be an identifier") ||
                  (!hasUniqueName(param.name) && "Already exists.")
                }
              />
            </div>
            <div className="min-w-[30%]">
              <Select
                label={`${capitalizeFirstLetter(stringifyNumber(index + 1))} param type`}
                value={param.type}
                onChange={(type) => onParameterChange(index, { ...param, type })}
                options={types}
              />
            </div>
          </div>
          <div className="mt-4 flex space-x-3 items-center">
            <label className="font-medium leading-6">Parameter options:</label>
            <Checkbox
              label="Array"
              checked={param.isCollection}
              onChange={(collection) =>
                onParameterChange(index, { ...param, isCollection: collection })
              }
            />
            <Checkbox
              label="Optional"
              checked={param.isOptional}
              onChange={(optional) => onParameterChange(index, { ...param, isOptional: optional })}
            />
          </div>

          <div className="flex items-center mt-2">
            <div className="ml-auto">
              <button onClick={() => onDeleteParameter(index)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
