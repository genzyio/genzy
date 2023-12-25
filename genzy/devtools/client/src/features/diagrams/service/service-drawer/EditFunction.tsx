import { useState, type FC } from "react";
import {
  type HTTPMethod,
  type ServiceFunction,
  type ParamSource,
  type ServiceType,
  PARAM_SOURCE,
} from "../models";
import { TextField } from "@core/components/text-field";
import { FunctionCard } from "./FunctionCard";
import { Select } from "@core/components/select";
import { IDENTIFIER_REGEX, ROUTE_REGEX } from "../../../../patterns";
import { useMicroserviceContext } from "../../common/contexts/microservice.context";
import { useTypesContext } from "../../class/TypesContext";
import { RoundCard } from "../../common/components/RoundCard";
import { ClosableWrapper } from "../../common/components/ClosableWrapper";
import cloneDeep from "lodash.clonedeep";
import { useValidationContext } from "../../common/contexts/validation-context";
import { Checkbox } from "@core/components/checkbox";
import { XMark } from "@core/components/icons/x-mark";
import { MethodListitem } from "./MethodsListbox";

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
  const { types } = useTypesContext(microserviceId);
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
          <div className="flex w-full mb-2 space-x-2">
            <MethodListitem
              className="w-[6em]"
              value={fun.method}
              onChange={(v) => {
                fun.method = v as HTTPMethod;
                updateState();
              }}
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
        <div key={fun.id} className="flex w-full mb-2 items-top space-x-2">
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

        {fun.params.length > 0 && (
          <label className="block text-sm font-medium leading-6">Parameters</label>
        )}
        <div className="ml-2">
          {fun.params.map((param, paramIndex) => (
            <div key={param.id} className="flex w-full justify-top space-x-1">
              <div className="w-1/3 flex-1">
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

              <span className="mt-[0.5em]">
                <div className="flex space-x-1 items-center">
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
                  <div onClick={() => handleDeleteParam(paramIndex)}>
                    <XMark className="h-4 w-4" />
                  </div>
                </div>
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-5">
          <button className="hover:text-gray-400" onClick={handleAddParam}>
            Add parameter
          </button>

          <button className="hover:text-gray-400" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </ClosableWrapper>
    </RoundCard>
  );
};
