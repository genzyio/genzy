import { type FC, useEffect } from "react";
import { defaultViewport, useProjectContext } from "../../../contexts/project.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { MicroservicesDiagram } from "../../../../model/microservices/MicroservicesDiagram";

type MicroserviceDiagramWrapperProps = {
  onMicroserviceDeleted: (microserviceName: string) => any;
};

export const MicroserviceDiagramWrapper: FC<MicroserviceDiagramWrapperProps> = ({
  onMicroserviceDeleted,
}) => {
  const { projectDefinition } = useProjectContext();
  const microserviceDiagram = projectDefinition.microservices;

  const { setMicroserviceId } = useMicroserviceContext();

  useEffect(() => {
    setMicroserviceId("");
  }, []);

  return (
    <MicroservicesDiagram
      nodes={microserviceDiagram.nodes}
      edges={microserviceDiagram.edges}
      viewport={microserviceDiagram.viewport || defaultViewport}
      onMicroserviceDeleted={onMicroserviceDeleted}
    />
  );
};
