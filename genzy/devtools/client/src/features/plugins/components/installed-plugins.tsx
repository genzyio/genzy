import { type FC, useState } from "react";
import { type Plugin } from "@features/diagrams/microservices/models";
import { KeywordsList } from "./keywords";
import { useMicroserviceContext } from "@features/diagrams/common/contexts/microservice.context";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
import { useSpecificPluginVersion } from "../hooks/useSpecificPluginVersion";
import { LoadingRow } from "@core/components/loading-row";
import { usePluginsNavigation } from "../hooks/usePluginsNavigation";

type PluginProps = {
  name: string;
  version: string;
};

const Plugin: FC<PluginProps> = ({ name, version }) => {
  const { openSpecificPlugin } = usePluginsNavigation();

  const { plugin, isFetching } = useSpecificPluginVersion(name, version);
  const [descriptionWidth] = useState(Math.floor(Math.random() * 71 + 30));
  const [versionWidth] = useState(Math.floor(Math.random() * 51 + 20));
  const { description, keywords, publisher } = plugin || {};

  if (isFetching) {
    return (
      <div className="space-y-2">
        <div className="font-medium text-xl">{name}</div>
        <LoadingRow color={"gray-500"} width={descriptionWidth} />
        <LoadingRow color={"gray-400"} width={versionWidth} />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div
        className="font-medium text-xl cursor-pointer hover:underline"
        onClick={() => openSpecificPlugin(name)}
      >
        {name}
      </div>

      {!!plugin.description && <div className="text-sm text-gray-600">{description}</div>}
      {!!keywords?.length && <KeywordsList keywords={keywords} />}

      <div className="flex text-gray-600">
        <span className="font-medium mr-1">{publisher.username || publisher.email}</span>
        published {version}
      </div>
    </div>
  );
};

export const InstalledPlugins: FC = () => {
  const { microserviceId } = useMicroserviceContext();
  const { projectDefinition } = useProjectDefinitionContext();

  const plugins =
    projectDefinition.microservices.nodes.find((node) => node.id === microserviceId)?.data
      ?.plugins ?? [];

  if (!plugins.length) {
    return (
      <p className="mt-5">
        You do not have any plugin installed yet. Go to the "Search" tab, find some and install it.
      </p>
    );
  }

  return (
    <div className="mt-5">
      {plugins?.map((plugin: Plugin) => (
        <div key={plugin.name} className="mb-2 border-b w-full border-gray-300 pb-2">
          <Plugin name={plugin.name} version={plugin.version} />
        </div>
      ))}
    </div>
  );
};
