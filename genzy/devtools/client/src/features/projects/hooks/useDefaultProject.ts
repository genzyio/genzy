import { useQuery } from "react-query";
import { getDefaultProject } from "../api/preferences.actions";

export function useDefaultProject(dependencies: any[] = []) {
  const { data, isFetching } = useQuery(
    [`preferences/projects/default`, ...dependencies],
    () => getDefaultProject(),
    {
      enabled: dependencies.reduce((acc, d) => acc && !d, true),
    }
  );

  return {
    defaultProject: (data?.data ?? "") as string,
    isFetching,
  };
}
