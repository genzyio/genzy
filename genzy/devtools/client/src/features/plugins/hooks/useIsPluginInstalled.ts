import { type Plugin } from "../../diagrams/microservices/models";
import { useMicroserviceContext } from "../../diagrams/common/contexts/microservice.context";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { useMemo } from "react";

export function useIsPluginInstalled(name: string) {
  const { microserviceId } = useMicroserviceContext();
  const { projectDefinition } = useProjectDefinitionContext();

  const installedPlugins = useMemo(
    () =>
      projectDefinition.microservices.nodes.find((node) => node.id === microserviceId)?.data
        ?.plugins ?? [],
    [microserviceId]
  );
  const installedVersion = useMemo(
    () => installedPlugins.find((plugin: Plugin) => plugin.name === name)?.version,
    [installedPlugins]
  );
  const isInstalled = !!installedVersion;

  return {
    isInstalled,
    installedVersion,
  };
}
