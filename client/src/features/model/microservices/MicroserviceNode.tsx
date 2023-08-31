import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Microservice } from "./models";
import { Button } from "../../../components/button";
import { useMicroserviceNodeContext } from "./MicroserviceNodeContext";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";

type MicroserviceNodeProps = NodeProps<Microservice>;

const colors = {
  CONTROLLER: "border-red-500",
  LOCAL: "border-green-300",
} as const;

export const MicroserviceNode: FC<MicroserviceNodeProps> = ({
  id: microserviceId,
  data: microservice,
}) => {
  const { onServicesClick, onModelsClick } = useMicroserviceNodeContext();

  return (
    <div className={`p-4 rounded-lg border-2 bg-white border-gray-600 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <h2 className="w-full text-center text-xl my-2">{microservice.name}</h2>
        {microservice.services.map((service) => (
          <div
            key={service.id}
            className={`flex w-full p-1 rounded-md border ${colors[service.type]}`}
          >
            <span>{service.name}</span>
          </div>
        ))}

        <div className="mt-1 flex gap-x-2">
          <Button
            type="button"
            className="text-sm mt-3"
            onClick={() => onServicesClick(microserviceId)}
          >
            Services
          </Button>
          <Button
            type="button"
            className="text-sm mt-3"
            onClick={() => onModelsClick(microserviceId)}
          >
            Models
          </Button>
        </div>
      </ConnectableNodeWrapper>
    </div>
  );
};
