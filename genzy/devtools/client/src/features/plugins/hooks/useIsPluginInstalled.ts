import { type Plugin } from "@features/diagrams/microservices/models";
import { useMicroserviceContext } from "@features/diagrams/common/contexts/microservice.context";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
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
