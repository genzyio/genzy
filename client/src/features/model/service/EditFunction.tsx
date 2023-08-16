import { useState, type FC } from "react";
import { type HTTPMethod, HTTP_METHOD, type ServiceFunction } from "./models";
import { TextField } from "../../../components/text-field";
import { FunctionCard } from "./FunctionCard";
import { Button } from "../../../components/button";
import { Select } from "../../../components/select";

type EditFunctionProps = {
  function: ServiceFunction;
  updateState: () => void;
  update: () => void;
  handleAddParam: (index: number) => void;
  handleDeleteParam: (index: number, paramIndex: number) => void;
  handleDelete: (index: number) => void;
  types: string[];
  index: number;
  edit?: boolean;
};

export const EditFunction: FC<EditFunctionProps> = ({
  function: fun,
  updateState,
  update,
  handleAddParam,
  types,
  index,
  handleDelete,
  handleDeleteParam,
  edit = false,
}) => {
  const [preview, setPreview] = useState(!edit);
  if (preview)
    return (
      <div className="py-2">
        <FunctionCard function={fun} onEdit={() => setPreview(false)} />
      </div>
    );
  return (
    <div className="py-2">
      <div key={fun.id} className="flex items-center w-full">
        <TextField
          value={fun.name}
          onChange={(v) => {
            fun.name = v;
            updateState();
          }}
          label="Function Name"
        />
        <TextField
          value={fun.route}
          onChange={(v) => {
            fun.route = v;
            updateState();
          }}
          label="Route"
        />
        <Select
          value={fun.method}
          onChange={(v) => {
            fun.method = v as HTTPMethod;
            updateState();
          }}
          options={Object.keys(HTTP_METHOD)}
          label="Method"
        />
        <Select
          value={fun.returnType}
          onChange={(v) => {
            fun.returnType = v;
            updateState();
          }}
          options={types}
          label="Returns"
        />
        <button onClick={() => handleDelete(index)} className="text-red-500 p-1">
          x
        </button>
      </div>
      <div className="ml-4">
        {fun.params.map((param, paramIndex) => (
          <div key={param.id} className="flex items-center w-full">
            <TextField
              value={param.name}
              onChange={(v) => {
                param.name = v;
                updateState();
              }}
              placeholder="Param Name"
            />
            <Select
              value={param.type}
              onChange={(v) => {
                param.type = v;
                updateState();
              }}
              options={types.map((t) => ({
                value: t,
                label: t + (param.isCollection ? " []" : ""),
              }))}
            />
            <input
              type="checkbox"
              checked={param.isCollection}
              onChange={() => {
                param.isCollection = !param.isCollection;
                updateState();
              }}
            />
            []
            <button
              onClick={() => handleDeleteParam(index, paramIndex)}
              className="text-red-500 p-1"
            >
              x
            </button>
          </div>
        ))}
        <Button onClick={() => handleAddParam(index)} className="text-xs">
          Add param
        </Button>
      </div>
      <button
        onClick={() => {
          setPreview(true);
          update();
        }}
      >
        Save
      </button>
    </div>
  );
};
