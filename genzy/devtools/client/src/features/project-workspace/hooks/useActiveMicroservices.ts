import { useQuery } from "react-query";
import { getActiveMicroservices } from "../api/watch-project.actions";

export function useActiveMicroservices(projectName: string, dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`projects/${projectName}/microservices/active`, ...dependencies],
    () => getActiveMicroservices(projectName),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!projectName,
    }
  );

  return {
    activeMicroservices: (data?.data ?? undefined) as string[],
    isFetching,
  };
}
