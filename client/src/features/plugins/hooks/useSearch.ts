import { useQuery } from "react-query";
import { getPlugins } from "../api/search.actions";
import { type NPMPackageInfo } from "../api/search.contracts";

export function useSearch(search: string, count = 7, dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`plugins/${search}?count=${count}`, ...dependencies],
    () => getPlugins(search, count),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!search,
    }
  );

  return {
    plugins: mapResponse(data?.data ?? []),
    total: data?.data?.total ?? 0,
    isFetching,
  };
}

function mapResponse(data: any) {
  return data?.objects?.map((npmPackage: any) => npmPackage.package) as NPMPackageInfo[];
}
