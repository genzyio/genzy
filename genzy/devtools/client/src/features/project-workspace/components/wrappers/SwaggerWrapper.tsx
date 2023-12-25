import { type FC } from "react";
import { useProjectContext } from "../../contexts/project.context";
import { useMicroservicePort } from "../../hooks/useMicroservicePort";
import { Loader } from "@features/plugins/components/loader";

type SwaggerWrapperProps = {
  microserviceId: string;
};

export const SwaggerWrapper: FC<SwaggerWrapperProps> = ({ microserviceId }) => {
  const { project } = useProjectContext();
  const { port, isFetching } = useMicroservicePort(project.name, microserviceId);

  if (!port || isFetching) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full">
      <iframe src={`http://localhost:${port}/explorer`} width={"100%"} height={"100%"}></iframe>
    </div>
  );
};
