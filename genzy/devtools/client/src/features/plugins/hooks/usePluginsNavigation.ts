import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../projects/contexts/project.context";
import { useMicroserviceContext } from "../../model/microservices/MicroserviceContext";

type PluginsNavigation = {
  openSpecificPlugin: (pluginName: string) => void;
  closeSpecificPlugin: () => void;
  openSearchPlugins: () => void;
  openInstalledPlugins: () => void;
};

const usePluginsNavigation = (): PluginsNavigation => {
  const { project } = useProjectContext();
  const { microserviceId } = useMicroserviceContext();
  const navigate = useNavigate();

  const openSpecificPlugin = useCallback(
    (pluginName: string) => {
      navigate(
        `/projects/${project.name}/microservices/${microserviceId}/plugins/specific/${pluginName}`
      );
    },
    [navigate, project, microserviceId]
  );

  const closeSpecificPlugin = useCallback(() => {
    navigate(`/projects/${project.name}/microservices/${microserviceId}/plugins`);
  }, [navigate, project, microserviceId]);

  const openSearchPlugins = useCallback(() => {
    navigate(`/projects/${project.name}/microservices/${microserviceId}/plugins/search`);
  }, [navigate, project, microserviceId]);

  const openInstalledPlugins = useCallback(() => {
    navigate(`/projects/${project.name}/microservices/${microserviceId}/plugins/installed`);
  }, [navigate, project, microserviceId]);

  return {
    openSpecificPlugin,
    closeSpecificPlugin,
    openSearchPlugins,
    openInstalledPlugins,
  };
};

export { usePluginsNavigation };
