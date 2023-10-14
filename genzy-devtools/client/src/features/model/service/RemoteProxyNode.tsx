import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { SERVICE_TYPE_DISPLAY_NAME, type Service } from "./models";
import { MethodChip } from "./MethodChip";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";
import { useProjectDefinitionContext } from "../../projects/contexts/project-definition.context";

type RemoteProxyNodeProps = NodeProps<Service>;

export const RemoteProxyNode: FC<RemoteProxyNodeProps> = ({ id: serviceId, data: service }) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const serviceDiagram = projectDefinition.services[service.microserviceId];
  const realService = serviceDiagram.nodes.find((node) => node.id === serviceId).data;

  return (
    <div className={`p-4 rounded-lg border-2 bg-white border-blue-300 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <div className="text-center w-full mb-2">
          <p className="text-xs text-gray-500">{SERVICE_TYPE_DISPLAY_NAME[service.type]}</p>
          <h2 className="text-xl">{realService.name}</h2>
        </div>
        {realService.functions.map((fun) => (
          <div key={fun.id} className="flex w-full p-1 rounded-md border border-gray-400">
            <span className="w-14 mr-2">
              <MethodChip method={fun.method} small />
            </span>

            <span className="">{fun.route}</span>
          </div>
        ))}
      </ConnectableNodeWrapper>
    </div>
  );
};
