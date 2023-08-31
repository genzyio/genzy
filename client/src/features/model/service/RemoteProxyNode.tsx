import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Service } from "./models";
import { MethodChip } from "./MethodChip";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";
import { useProjectContext } from "../../projects/contexts/project.context";

type RemoteProxyNodeProps = NodeProps<Service>;

export const RemoteProxyNode: FC<RemoteProxyNodeProps> = ({ id: serviceId, data: service }) => {
  const { projectDefinition } = useProjectContext();
  const serviceDiagram = projectDefinition.services[service.microserviceId];
  const realService = serviceDiagram.nodes.find((node) => node.id === serviceId).data;

  return (
    <div className={`p-4 rounded-lg border-2 bg-blue-50 border-blue-300 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <p className="text-xs text-gray-500">REMOTE_PROXY</p>
        <h2 className="w-full text-center text-xl my-2">{realService.name}</h2>
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
