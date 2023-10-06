import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Microservice } from "./models";
import { Button } from "../../../components/button";
import { useMicroserviceNodeContext } from "./MicroserviceNodeContext";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";
import { Link } from "react-router-dom";
import { useProjectContext } from "../../projects/contexts/project.context";
import { useWatchModeContext } from "../../projects/contexts/watch-mode.context";

type MicroserviceNodeProps = NodeProps<Microservice>;

const colors = {
  CONTROLLER: "border-red-500",
  LOCAL: "border-green-300",
  API_INTEGRATION: "border-yellow-300",
} as const;

export const MicroserviceNode: FC<MicroserviceNodeProps> = ({
  id: microserviceId,
  data: microservice,
}) => {
  const { project } = useProjectContext();
  const { isMicroserviceActive } = useWatchModeContext();
  const { onServicesClick, onModelsClick, onDocsClick } = useMicroserviceNodeContext();

  const microserviceActive = isMicroserviceActive(microserviceId);

  return (
    <div className={`p-4 rounded-lg border-2 bg-white border-gray-600 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <div>
          <h6 className="w-full text-center text-sm text-gray-700">{microservice.basePath}</h6>
          <h2 className="w-full text-center text-xl mb-2">
            {microservice.name}{" "}
            <span className="text-base">
              {!!microservice.language ? `(${microservice.language.toLocaleUpperCase()})` : ""}
            </span>
          </h2>
        </div>
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
          {microserviceActive && (
            <Button type="button" onClick={() => onDocsClick(microserviceId)}>
              Docs
            </Button>
          )}
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
