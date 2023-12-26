import { type FC, useCallback } from "react";
import { Form } from "@core/components/form";
import { Parameter } from "../../models";
import { IDENTIFIER_REGEX } from "../../../../../patterns";
import { capitalizeFirstLetter, stringifyNumber } from "@core/utils/string";

type EditParametersProps = {
  parameters: Parameter[];
  onParameterChange: (index: number, param: any) => any;
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
    <div className="mt-2">
      {parameters.length > 0 && <label className="text-sm font-medium leading-6">Parameters</label>}
      {parameters.map((param, index) => (
        <div key={index} className="flex flex-col p-2">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Form.TextField
                label={`${capitalizeFirstLetter(stringifyNumber(index + 1))} parameter name`}
                value={param.name}
                onChange={(name) => onParameterChange(index, { ...param, name })}
                error={
                  (!isIdentifier(param.name) && "Must be an identifier") ||
                  (!hasUniqueName(param.name) && "Already exists.")
                }
              />
            </div>
            <div className="min-w-[30%]">
              <Form.SelectOption
                label={`Type`}
                value={param.type}
                onChange={(type) => onParameterChange(index, { ...param, type })}
                options={types}
              />
            </div>
          </div>

          <div className="mt-1 flex justify-between">
            <div className="flex space-x-3 items-center">
              <label className="text-sm font-medium leading-6">Parameter options:</label>
              <Form.Checkbox
                label="Array"
                checked={param.isCollection}
                onChange={(collection) =>
                  onParameterChange(index, { ...param, isCollection: collection })
                }
              />
              <Form.Checkbox
                label="Optional"
                checked={param.isOptional}
                onChange={(optional) =>
                  onParameterChange(index, { ...param, isOptional: optional })
                }
              />
            </div>

            <div className="">
              <button
                onClick={() => onDeleteParameter(index)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
