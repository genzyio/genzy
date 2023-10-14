import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { SERVICE_TYPE_DISPLAY_NAME, type Service } from "./models";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";

type PlugableServiceNodeProps = NodeProps<Service>;

export const PlugableServiceNode: FC<PlugableServiceNodeProps> = ({
  id: serviceId,
  data: service,
}) => {
  return (
    <div className={`p-4 rounded-lg border-2 bg-white border-amber-500 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <div className="text-center w-full mb-2">
          <p className="text-xs text-gray-500">{SERVICE_TYPE_DISPLAY_NAME[service.type]}</p>
          <h2 className="text-xl">{service.name}</h2>
        </div>
        {service.functions.map((fun) => (
          <div key={fun.id} className="flex w-full p-1 rounded-md border border-gray-400">
            <span className="">{fun.name}</span>
          </div>
        ))}
      </ConnectableNodeWrapper>
    </div>
  );
};
