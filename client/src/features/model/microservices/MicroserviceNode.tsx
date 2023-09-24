import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Microservice } from "./models";
import { Button } from "../../../components/button";
import { useMicroserviceNodeContext } from "./MicroserviceNodeContext";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";
import { Link } from "react-router-dom";
import { useProjectContext } from "../../projects/contexts/project.context";

type MicroserviceNodeProps = NodeProps<Microservice>;

const colors = {
  CONTROLLER: "border-red-500",
  LOCAL: "border-green-300",
} as const;

export const MicroserviceNode: FC<MicroserviceNodeProps> = ({
  id: microserviceId,
  data: microservice,
}) => {
  const { project } = useProjectContext();
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

        <div className="mt-3 flex gap-x-2 text-sm">
          <Button type="button" onClick={() => onServicesClick(microserviceId)}>
            Services
          </Button>
          <Button type="button" onClick={() => onModelsClick(microserviceId)}>
            Models
          </Button>
          <Button type="button">
            <Link to={`/projects/${project.name}/plugins/${microserviceId}`} replace>
              Plugins
            </Link>
          </Button>
        </div>
      </ConnectableNodeWrapper>
    </div>
  );
};
