import { useState, type FC } from "react";
import {
  type HTTPMethod,
  type ServiceFunction,
  type ParamSource,
  type ServiceType,
  HTTP_METHOD,
  PARAM_SOURCE,
} from "./models";
import { TextField } from "../../../components/text-field";
import { FunctionCard } from "./FunctionCard";
import { Button } from "../../../components/button";
import { Select } from "../../../components/select";
import { IDENTIFIER_REGEX, ROUTE_REGEX } from "../../../patterns";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "../class/TypesContext";
import { RoundCard } from "../common/components/RoundCard";
import { ClosableWrapper } from "../common/components/ClosableWrapper";
import cloneDeep from "lodash.clonedeep";
import { useValidationContext } from "../common/contexts/validation-context";
import { Checkbox } from "../../../components/checkbox";
import { XMark } from "../../../components/icons/x-mark";

type EditFunctionProps = {
  function: ServiceFunction;
  serviceType: ServiceType;
  updateState: () => void;
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
  handleAddParam,
  handleDelete,
  handleDeleteParam,
  edit = false,
  nameExists,
  routeExists,
}) => {
  const { microserviceId } = useMicroserviceContext();
  const { typesWithVoid: types } = useTypesContext(microserviceId);
  const { setValidityFor } = useValidationContext();

  const [initialFunction, setInitialFunction] = useState(cloneDeep(fun));

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

  const onClose = () => {
    setPreview(true);
    setInitialFunction(cloneDeep(fun));
  };

  const onCancel = () => {
    setPreview(true);
    setValidityFor(initialFunction.id, true);
    fun.route = initialFunction.route;
    fun.method = initialFunction.method;
    fun.name = initialFunction.name;
    fun.returnType = initialFunction.returnType;
    fun.returnsCollection = initialFunction.returnsCollection;
    fun.params = cloneDeep(initialFunction.params);
    updateState();
  };

  const isRouteIdentifier = ROUTE_REGEX.test(fun.route);
  const hasUniqueRoute = !routeExists(fun.route, fun.method);

  const isFunctionIdentifier = IDENTIFIER_REGEX.test(fun.name);
  const hasUniqueFunction = !nameExists(fun.name);

  const areParamsIdentifiers = fun.params.every((param) => IDENTIFIER_REGEX.test(param.name));
  const areParamsUnique = fun.params.every(
    (param) => !fun.params.some((p) => p.id !== param.id && p.name === param.name)
  );
  const arePathParamsInRoute = fun.params
    .filter((param) => param.source === "PATH")
    .every(
      (param) => fun.route.includes(`:${param.name}/`) || fun.route.endsWith(`:${param.name}`)
    );

  const isValidFunction =
    (editRoute ? isRouteIdentifier && hasUniqueRoute : true) &&
    isFunctionIdentifier &&
    hasUniqueFunction &&
    areParamsIdentifiers &&
    areParamsUnique &&
    arePathParamsInRoute;
  setValidityFor(initialFunction.id, isValidFunction);

  return (
    <RoundCard className="py-2">
      <ClosableWrapper hidden={!isValidFunction} onClick={onClose}>
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
                  (!isRouteIdentifier && "Must be a valid route") ||
                  (!hasUniqueRoute && "Already exists")
                }
              />
            </div>
          </div>
        )}
        <div key={fun.id} className="flex w-full mb-2">
          <div className="flex w-full items-top mr-2">
            <div className="flex-1">
              <TextField
                value={fun.name}
                onChange={(v) => {
                  fun.name = v;
                  updateState();
                }}
                label="Function Name"
                error={
                  (!isFunctionIdentifier && "Must be an identifier") ||
                  (!hasUniqueFunction && "Already exists")
                }
              />
            </div>
            <Select
              value={fun.returnType}
              onChange={(v) => {
                fun.returnType = v;
                updateState();
              }}
              options={types}
              label="Returns"
            />
          </div>
          <span className="mt-[2em]">
            <Checkbox
              label="Array"
              checked={fun.returnsCollection}
              onChange={() => {
                fun.returnsCollection = !fun.returnsCollection;
                updateState();
              }}
            />
          </span>
        </div>
        <label className="block text-sm font-medium leading-6 text-gray-900">Parameters</label>
        <div className="ml-4">
          {fun.params.map((param, paramIndex) => (
            <div key={param.id} className="flex w-full">
              <div className="flex justify-top mr-2">
                <div className="w-1/3">
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
                      (param.source === "PATH" &&
                        !(
                          fun.route.includes(`:${param.name}/`) ||
                          fun.route.endsWith(`:${param.name}`)
                        ) &&
                        "Not in path")
                    }
                  />
                </div>
                {editRoute && (
                  <Select
                    className="text-xs"
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
              </div>
              <span className="flex space-x-2 items-center">
                <Checkbox
                  label="Array"
                  checked={param.isCollection}
                  onChange={() => {
                    param.isCollection = !param.isCollection;
                    updateState();
                  }}
                />
                <Checkbox
                  label="Optional"
                  checked={param.isOptional}
                  onChange={() => {
                    param.isOptional = !param.isOptional;
                    updateState();
                  }}
                />

                <div
                  onClick={() => handleDeleteParam(paramIndex)}
                  // className="text-red-500 text-lg font-bold p-2"
                >
                  <XMark className="h-4 w-4" />
                </div>
              </span>
            </div>
          ))}
          <Button onClick={handleAddParam} className="text-xs mt-2">
            Add parameter
          </Button>
        </div>
        <div className="flex justify-end space-x-2 mt-5">
          <button onClick={onCancel}>Cancel</button>
        </div>
      </ClosableWrapper>
    </RoundCard>
  );
};
