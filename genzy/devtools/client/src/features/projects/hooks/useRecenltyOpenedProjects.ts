import { useQuery } from "react-query";
import { getRecentlyOpenedProjects } from "../api/recently-opened.actions";
import { type RecentlyOpenedProject } from "../models/recently-opened.models";

export function useRecentlyOpenedProjects(dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`projects/recently-opened`, ...dependencies],
    () => getRecentlyOpenedProjects(),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true),
    }
  );

  return {
    recentlyOpenedProjects: (data?.data ?? []) as RecentlyOpenedProject[],
    isFetching,
  };
}
