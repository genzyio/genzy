import { useInfiniteQuery } from "react-query";
import { getPlugins } from "../api/search.actions";
import { type NPMPackageInfo } from "../api/search.contracts";

export function useSearch(search: string, count = 7, dependencies: any[] = []) {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    [`plugins/${search}?count=${count}`, ...dependencies],
    async ({ pageParam = 0 }) => {
      const response = await getPlugins(search, pageParam);
      return {
        total: response.data.total,
        packages: mapResponse(response.data.objects),
      };
    },
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!search,
      getNextPageParam: (currentResponse: any, allPages: any[]) => {
        const totalPackages = currentResponse.total;
        const fetchedPackages = allPages.flatMap((page) => page.packages).length;
        const nextPage = allPages.length;

        return totalPackages > fetchedPackages ? nextPage : undefined;
      },
    }
  );

  return {
    plugins: data?.pages?.flatMap((page) => page.packages) ?? [],
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}

function mapResponse(objects: any[]) {
  return objects.map((npmPackage: any) => npmPackage.package) as NPMPackageInfo[];
}
