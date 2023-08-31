import { useQuery } from "react-query";
import { type Project } from "../models/project.models";
import { getProject, getProjects } from "../api/project.actions";

export function useProjects(dependencies: any[] = []) {
  const { data, isFetching } = useQuery([`projects`, ...dependencies], () => getProjects(), {
    enabled: dependencies.reduce((acc, d) => acc && !d, true),
  });

  return {
    projects: (data?.data ?? []) as Project[],
    isFetching,
  };
}

export function useProject(projectName: string, dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`projects/${projectName}`, ...dependencies],
    () => getProject(projectName),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true) && !!projectName,
    }
  );

  return {
    project: (data?.data ?? {}) as Project,
    isFetching,
  };
}
