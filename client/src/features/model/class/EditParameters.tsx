import { type FC } from "react";
import { TextField } from "../../../components/text-field";
import { Select } from "../../../components/select";
import { Parameter } from "./models";
import { Checkbox } from "../../../components/checkbox";

type EditParametersProps = {
  parameters: Parameter[];
  onParameterChange: (index: number, {}) => any;
  onAddParameter: () => any;
  onDeleteParameter: (index: number) => any;
  types: any;
};

export const EditParameters: FC<EditParametersProps> = ({
  parameters,
  onParameterChange,
  onAddParameter,
  onDeleteParameter,
  types,
}) => {
  return (
    <div>
      {parameters.map((param, index) => (
        <div key={index} className="flex flex-col mb-2 mt-4 p-3 shadow-md">
          <div className="flex">
            <div className="mr-4">
              <TextField
                value={param.name}
                onChange={(name) => onParameterChange(index, { ...param, name })}
                label={`Param ${index + 1} name`}
              />
            </div>

            <Select
              value={param.type}
              onChange={(type) => onParameterChange(index, { ...param, type })}
              options={types}
              label={`Param ${index + 1} type`}
            />
          </div>
          <div className="mt-4">
            <Checkbox
              checked={param.isCollection}
              label="Is collection"
              onChange={(collection) =>
                onParameterChange(index, { ...param, isCollection: collection })
              }
            />
          </div>
          <div className="flex items-center mt-4">
            <Checkbox
              checked={param.isOptional}
              label="Is optional"
              onChange={(optional) => onParameterChange(index, { ...param, isOptional: optional })}
            />
            <div className="ml-auto ">
              <button onClick={() => onDeleteParameter(index)} className="text-red-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <button onClick={onAddParameter} className="mt-2">
        Add Parameter
      </button>
    </div>
  );
};
