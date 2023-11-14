import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Service, SERVICE_TYPE_DISPLAY_NAME } from "../models";
import { ConnectableNodeWrapper } from "../../common/components/nodes/ConnectableNodeWrapper";
import { NodeBase } from "../../common/components/nodes/NodeBase";

type PlugableServiceNodeProps = NodeProps<Service>;

export const PlugableServiceNode: FC<PlugableServiceNodeProps> = ({
  id: serviceId,
  data: service,
}) => {
  return (
    <ConnectableNodeWrapper>
      <NodeBase
        borderColor="border-amber-500"
        header={SERVICE_TYPE_DISPLAY_NAME[service.type]}
        title={service.name}
      >
        <div className="space-y-2">
          {service.functions.map((fun) => (
            <div key={fun.id} className="w-full p-1 rounded-md border border-gray-400">
              {fun.name}
            </div>
          ))}
        </div>
      </NodeBase>
    </ConnectableNodeWrapper>
  );
};
