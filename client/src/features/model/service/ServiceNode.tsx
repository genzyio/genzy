import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Service } from "./models";
import { MethodChip } from "./MethodChip";
import { ConnectableNodeWrapper } from "../common/ConnectableNodeWrapper";

const colors = {
  LOCAL: "bg-green-50 border-green-300",
  CONTROLLER: "bg-red-50 border-red-300",
  REMOTE_PROXY: "bg-blue-50 border-blue-300",
} as const;

type ServiceNodeProps = NodeProps<Service>;

export const ServiceNode: FC<ServiceNodeProps> = ({ data: service }) => {
  const showRoute = service.type !== "LOCAL";

  return (
    <div className={`p-4 rounded-lg border-2 ${colors[service.type]}`}>
      <ConnectableNodeWrapper>
        <p className="text-xs text-gray-500">{service.type}</p>
        <h2 className="w-full text-center text-xl my-2">{service.name}</h2>
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
