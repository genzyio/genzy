import { useQuery } from "react-query";
import { getPlugin } from "../api/specific-plugin.actions";
import { type NPMPackage } from "../api/specific-plugin.contracts";

export function usePlugin(pluginName: string, dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`plugins/specific/${pluginName}`, ...dependencies],
    () => getPlugin(pluginName),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!pluginName,
    }
  );

  return {
    plugin: !isFetching ? mapResponse(data?.data ?? {}) : ({} as NPMPackage),
    isFetching,
  };
}

function mapResponse(data: any): NPMPackage {
  const latestVersion = data["dist-tags"]?.latest || Object.keys(data.versions || {}).pop();
  const lastModified = data.time.modified || data.time.created;
  const versions = Object.values(data.versions || {}).map((version: any) => ({
    ...version,
    value: version.version,
    dependencies: Object.entries(version.dependencies || {}).map(
      ([dep, version]: [string, string]) => ({
        name: dep,
        version: version.replace("^", ""),
      })
    ),
    devDependencies: Object.entries(version.devDependencies || {}).map(
      ([dep, version]: [string, string]) => ({
        name: dep,
        version: version.replace("^", ""),
      })
    ),
    date: data.time[version.version],
  }));
  const repository =
    data.repository?.type === "git" ? data.repository.url.replace("git+", "") : undefined;

  return {
    name: data.name,
    latestVersion,
    lastModified,
    homepage: data.homepage,
    repository,
    versions,
  };
}
