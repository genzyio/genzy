import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Service, SERVICE_TYPE_DISPLAY_NAME } from "../models";
import { useProjectDefinitionContext } from "../../../project-workspace/contexts/project-definition.context";
import { ConnectableNodeWrapper } from "../../common/components/nodes/ConnectableNodeWrapper";
import { NodeBase } from "../../common/components/nodes/NodeBase";
import { MethodChip } from "../MethodChip";

const useProxyTargetService = (microserviceId: string, serviceId: string) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const serviceDiagram = projectDefinition.services[microserviceId];
  const targetService = serviceDiagram.nodes.find((node) => node.id === serviceId).data;

  return targetService;
};

type RemoteProxyNodeProps = NodeProps<Service>;

export const RemoteProxyNode: FC<RemoteProxyNodeProps> = ({ id: serviceId, data: service }) => {
  const targetService = useProxyTargetService(service.microserviceId, serviceId);

  return (
    <ConnectableNodeWrapper>
      <NodeBase
        borderColor="border-blue-300"
        header={SERVICE_TYPE_DISPLAY_NAME[service.type]}
        title={targetService.name}
      >
        <div className="space-y-2">
          {targetService.functions.map((fun) => (
            <div key={fun.id} className="flex space-x-2 p-1 rounded-md border border-gray-400">
              <MethodChip className="w-14" method={fun.method} small />
              <span>{fun.route}</span>
            </div>
          ))}
        </div>
      </NodeBase>
    </ConnectableNodeWrapper>
  );
};
