import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Microservice } from "./models";
import { Button } from "../../../components/button";
import { useMicroserviceNodeContext } from "./MicroserviceNodeContext";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";
import { Link } from "react-router-dom";
import { useProjectContext } from "../../projects/contexts/project.context";
import { useWatchModeContext } from "../../projects/contexts/watch-mode.context";
import { getImageProxyUrl } from "../../../utils/proxy-image";
import { LanguageIcons } from "./constants";

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
    <div
      className={`p-4 rounded-lg border-2 bg-brand-node-dark border-gray-500 flex flex-col gap-y-2`}
    >
      <ConnectableNodeWrapper>
        <div className="w-full mb-2">
          <h6 className="text-center text-sm">{microservice.basePath}</h6>
          <h2 className="flex justify-center">
            <div className="flex space-x-2 items-center">
              <span className="text-xl">{microservice.name}</span>
              <span>
                {!!microservice.language && (
                  <img
                    src={getImageProxyUrl(LanguageIcons[microservice.language])}
                    height={16}
                    width={16}
                  />
                )}
              </span>
            </div>
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
            <Link to={`/projects/${project.name}/microservices/${microserviceId}/plugins`} replace>
              Plugins
            </Link>
          </Button>
        </div>
      </ConnectableNodeWrapper>
    </div>
  );
};
