import { useQuery } from "react-query";
import { type ProjectDefinition } from "../models/project-definition.models";
import { getProjectDefinition } from "../api/project-definition.actions";

export function useProjectDefinition(projectName: string, dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`projects/${projectName}/definition`, ...dependencies],
    () => getProjectDefinition(projectName),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!projectName,
    }
  );

  return {
    projectDefinition: (data?.data ?? {}) as ProjectDefinition,
    isFetching,
  };
}
