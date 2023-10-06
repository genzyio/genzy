import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { SERVICE_TYPE_DISPLAY_NAME, type Service } from "./models";
import { MethodChip } from "./MethodChip";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";

const colors = {
  LOCAL: "border-green-300",
  CONTROLLER: "border-red-300",
  REMOTE_PROXY: "border-blue-300",
  API_INTEGRATION: "border-yellow-300",
} as const;

type ServiceNodeProps = NodeProps<Service>;

export const ServiceNode: FC<ServiceNodeProps> = ({ data: service }) => {
  const showRoute = service.type !== "LOCAL";

  const url = `${service.host || ""}${
    service.host?.endsWith("/") && service.basePath?.startsWith("/")
      ? service.basePath.substring(1)
      : service.basePath
  }`;

  return (
    <div
      className={`p-4 rounded-lg border-2 bg-white ${colors[service.type]} flex flex-col gap-y-2`}
    >
      <ConnectableNodeWrapper>
        <div className="text-center w-full mb-2">
          <p className="text-xs text-gray-500">{SERVICE_TYPE_DISPLAY_NAME[service.type]}</p>

          <h2 className="text-xl">{service.name}</h2>
          {!!url && url !== "/" && <h6 className="text-center text-xs text-gray-500">{url}</h6>}
        </div>
        {service.functions.map((fun) => (
          <div key={fun.id} className="flex w-full p-1 rounded-md border border-gray-400">
            {showRoute && (
              <span className="w-14 mr-2">
                <MethodChip method={fun.method} small />
              </span>
            )}
            <span className="">{showRoute ? fun.route : fun.name}</span>
          </div>
        ))}
      </ConnectableNodeWrapper>
    </div>
  );
};
