import { useQuery } from "react-query";
import { getSpecificPluginVersion } from "../api/specific-plugin.actions";
import { type NPMPackageInfo } from "../api/search.contracts";

export function useSpecificPluginVersion(
  pluginName: string,
  pluginVersion: string,
  dependencies: any[] = []
) {
  const { data, isFetching } = useQuery(
    [`plugins/specific/${pluginName}/${pluginVersion}`, ...dependencies],
    () => getSpecificPluginVersion(pluginName, pluginVersion),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!pluginName,
    }
  );

  return {
    plugin: !isFetching ? mapResponse(data?.data ?? {}) : undefined,
    isFetching,
  };
}

function mapResponse(data: any): NPMPackageInfo {
  return {
    name: data.name,
    version: data.version,
    description: data.description,
    keywords: data.keywords || [],
    date: "",
    publisher: { username: data._npmUser?.name, email: data._npmUser?.email },
  };
}
