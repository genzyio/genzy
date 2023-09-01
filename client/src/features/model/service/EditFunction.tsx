import { useState, type FC } from "react";
import {
  type HTTPMethod,
  HTTP_METHOD,
  type ServiceFunction,
  type ParamSource,
  PARAM_SOURCE,
  type ServiceType,
} from "./models";
import { TextField } from "../../../components/text-field";
import { FunctionCard } from "./FunctionCard";
import { Button } from "../../../components/button";
import { Select } from "../../../components/select";
import { IDENTIFIER_REGEX, ROUTE_REGEX } from "../../../patterns";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "../class/TypesContext";
import { RoundCard } from "../common/components/RoundCard";

type EditFunctionProps = {
  function: ServiceFunction;
  serviceType: ServiceType;
  updateState: () => void;
  update: () => void;
  handleAddParam: () => void;
  handleDeleteParam: (paramIndex: number) => void;
  handleDelete: () => void;
  edit?: boolean;
  nameExists: (name: string) => boolean;
  routeExists: (name: string, method: HTTPMethod) => boolean;
};

export const EditFunction: FC<EditFunctionProps> = ({
  function: fun,
  serviceType,
  updateState,
  update,
  handleAddParam,
  handleDelete,
  handleDeleteParam,
  edit = false,
  nameExists,
  routeExists,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { typesWithVoid: types } = useTypesContext(microserviceId);

  const [preview, setPreview] = useState(!edit);

  const editRoute = serviceType !== "LOCAL";

  if (preview)
    return (
      <RoundCard className="py-2">
        <FunctionCard
          function={fun}
          serviceType={serviceType}
          onEdit={() => setPreview(false)}
          onDelete={handleDelete}
        />
      </RoundCard>
    );

  return (
    <RoundCard className="py-2">
      {editRoute && (
        <div className="flex w-full mb-2">
          <Select
            value={fun.method}
            onChange={(v) => {
              fun.method = v as HTTPMethod;
              updateState();
            }}
            options={Object.keys(HTTP_METHOD)}
            label="Method"
          />
          <div className="flex-1">
            <TextField
              value={fun.route}
              onChange={(v) => {
                fun.route = v;
                updateState();
              }}
              label="Route"
              error={
                (!ROUTE_REGEX.test(fun.route) && "Must be a valid route") ||
                (routeExists(fun.route, fun.method) && "Already exists")
              }
            />
          </div>
        </div>
      )}
      <div key={fun.id} className="flex items-center w-full mb-2">
        <TextField
          value={fun.name}
          onChange={(v) => {
            fun.name = v;
            updateState();
          }}
          label="Function Name"
          error={
            (!IDENTIFIER_REGEX.test(fun.name) && "Must be an identifier") ||
            (nameExists(fun.name) && "Already exists")
          }
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
        <span className="mt-5">
          <input
            type="checkbox"
            checked={fun.returnsCollection}
            onChange={() => {
              fun.returnsCollection = !fun.returnsCollection;
              updateState();
            }}
          />
          []
        </span>
      </div>
      <label className="block text-sm font-medium leading-6 text-gray-900">Parameters</label>
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
              error={
                (!IDENTIFIER_REGEX.test(param.name) && "Must be an identifier") ||
                (fun.params.some((p) => p.id !== param.id && p.name === param.name) &&
                  "Duplicate") ||
                (param.source === "PATH" && !fun.route.includes(`{${param.name}}`) && "Not in path")
              }
            />
            {editRoute && (
              <Select
                value={param.source}
                onChange={(v) => {
                  param.source = v as ParamSource;
                  updateState();
                }}
                options={Object.keys(PARAM_SOURCE)}
              />
            )}
            <Select
              value={param.type}
              onChange={(v) => {
                param.type = v;
                updateState();
              }}
              options={types}
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
              onClick={() => handleDeleteParam(paramIndex)}
              className="text-red-500 text-lg font-bold p-2"
            >
              x
            </button>
          </div>
        ))}
        <Button onClick={handleAddParam} className="text-xs mt-2">
          Add param
        </Button>
      </div>
      <div className="flex justify-end mt-2">
        <button
          onClick={() => {
            setPreview(true);
            update();
          }}
        >
          Save
        </button>
      </div>
    </RoundCard>
  );
};
