import axios from "axios";
import { useQuery } from "react-query";
import { type Project } from "./projects-models";

export function useProjects(dependencies: any[] = []) {
  const { data } = useQuery([`projects`, ...dependencies], () => axios.get(`/projects`), {
    enabled: dependencies.reduce((acc, d) => acc && !d, true),
  });

  return {
    projects: (data?.data ?? []) as Project[],
  };
}
