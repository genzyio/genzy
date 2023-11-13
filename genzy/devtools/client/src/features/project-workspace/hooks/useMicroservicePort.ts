import { useQuery } from "react-query";
import { getMicroservicePort } from "../api/microservice.actions";

export function useMicroservicePort(
  projectName: string,
  microserviceId: string,
  dependencies: any[] = []
) {
  const { data, isFetching } = useQuery(
    [`projects/${projectName}/microservices/${microserviceId}/port`, ...dependencies],
    () => getMicroservicePort(projectName, microserviceId),
    {
      enabled:
        dependencies.reduce((acc, d) => acc && !d, true) && !!projectName && !!microserviceId,
    }
  );

  return {
    port: (data?.data?.port ?? undefined) as number,
    isFetching,
  };
}
