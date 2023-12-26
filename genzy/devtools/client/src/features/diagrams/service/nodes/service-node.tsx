import { type FC, useMemo } from "react";
import { type NodeProps } from "reactflow";
import { type Service, type ServiceFunction, SERVICE_TYPE_DISPLAY_NAME } from "../models";
import { ConnectableNodeWrapper } from "../../common/components/nodes/connectable-node-wrapper";
import { NodeBase } from "../../common/components/nodes/node-base";
import { MethodChip } from "../method-chip";

const colors = {
  LOCAL: "border-green-500",
  CONTROLLER: "border-red-500",
  REMOTE_PROXY: "border-blue-500",
  API_INTEGRATION: "border-yellow-500",
} as const;

type ServiceNodeProps = NodeProps<Service>;

export const ServiceNode: FC<ServiceNodeProps> = ({ data: service }) => {
  const [typeName, color, showRoute] = getSpecificServiceData(service.type);
  const url = formatServiceUrl(service.type, service.host, service.basePath);

  const ListComponent = useMemo(() => {
    return showRoute ? Endpoint : Function;
  }, [showRoute]);

  return (
    <ConnectableNodeWrapper>
      <NodeBase
        borderColor={color}
        header={typeName}
        title={service.name}
        description={!!url && url !== "/" ? url : undefined}
      >
        <div className="space-y-2">
          {service.functions.map((fun) => {
            return (
              <div key={fun.id} className="p-1 rounded-md border border-gray-400">
                <ListComponent {...fun} />
              </div>
            );
          })}
        </div>
      </NodeBase>
    </ConnectableNodeWrapper>
  );
};

const Endpoint: FC<ServiceFunction> = ({ route, method }) => {
  return (
    <div className="flex space-x-2">
      <MethodChip className="w-14" method={method} small />
      <span>{route || "/"}</span>
    </div>
  );
};

const Function: FC<ServiceFunction> = ({ name }) => {
  return <span>{name}</span>;
};

function getSpecificServiceData(type: Service["type"]) {
  const typeName = SERVICE_TYPE_DISPLAY_NAME[type];
  const color = colors[type];
  const showRoute = type !== "LOCAL";

  return [typeName, color, showRoute];
}

function formatServiceUrl(type: string, host: string, basePath: string) {
  if (type === "LOCAL") return "";

  const formattedHost = (type === "API_INTEGRATION" ? host : undefined) || "";
  const formattedBasePath =
    host?.endsWith("/") && basePath?.startsWith("/") ? basePath.substring(1) : basePath;

  return formattedHost + formattedBasePath;
}
