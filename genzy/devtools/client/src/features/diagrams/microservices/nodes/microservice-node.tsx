import { useCallback, type FC } from "react";
import { type NodeProps } from "reactflow";
import { type Microservice } from "../models";
import { useWatchModeContext } from "@features/project-workspace/contexts/watch-mode.context";
import { useProjectContext } from "@features/project-workspace/contexts/project.context";
import { getImageProxyUrl } from "@core/utils/proxy-image";
import { LanguageIcons } from "../constants";
import { ConnectableNodeWrapper } from "../../common/components/nodes/connectable-node-wrapper";
import { NodeBase } from "../../common/components/nodes/node-base";
import { Button } from "@core/components/button";
import { Link } from "react-router-dom";
import { eventEmitter } from "@core/utils/event-emitter";
import { MicroserviceEvents } from "../microservices-diagram.events";

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
  return (
    <ConnectableNodeWrapper>
      <NodeBase
        borderColor="border-gray-500"
        title={<MicroserviceTitle microservice={microservice} />}
        description={microservice.basePath}
      >
        <div className="space-y-2">
          {microservice.services.map((service) => (
            <div key={service.id} className={`p-1 rounded-md border ${colors[service.type]}`}>
              {service.name}
            </div>
          ))}
        </div>

        <MicroserviceOptions microserviceId={microserviceId} />
      </NodeBase>
    </ConnectableNodeWrapper>
  );
};

const MicroserviceTitle: FC<{ microservice: Microservice }> = ({ microservice }) => {
  return (
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
  );
};

const MicroserviceOptions: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { project } = useProjectContext();
  const { isMicroserviceActive } = useWatchModeContext();
  const microserviceActive = isMicroserviceActive(microserviceId);

  const onServicesClick = useCallback(() => {
    eventEmitter.dispatch(MicroserviceEvents.ON_SERVICES_CLICK, microserviceId);
  }, [microserviceId]);

  const onModelsClick = useCallback(() => {
    eventEmitter.dispatch(MicroserviceEvents.ON_MODELS_CLICK, microserviceId);
  }, [microserviceId]);

  const onDocsClick = useCallback(() => {
    eventEmitter.dispatch(MicroserviceEvents.ON_DOCS_CLICK, microserviceId);
  }, [microserviceId]);

  return (
    <div className="mt-3 flex gap-x-2 text-sm">
      <Button type="button" onClick={onServicesClick}>
        Services
      </Button>
      <Button type="button" onClick={onModelsClick}>
        Models
      </Button>
      {microserviceActive && (
        <Button type="button" onClick={onDocsClick}>
          Docs
        </Button>
      )}
      <Button type="button">
        <Link to={`/projects/${project.name}/microservices/${microserviceId}/plugins`} replace>
          Plugins
        </Link>
      </Button>
    </div>
  );
};
