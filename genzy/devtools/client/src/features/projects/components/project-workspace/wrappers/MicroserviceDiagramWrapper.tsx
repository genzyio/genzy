import { type FC, useEffect } from "react";
import { useProjectDefinitionContext } from "../../../contexts/project-definition.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { MicroservicesDiagram } from "../../../../model/microservices/MicroservicesDiagram";
import { defaultViewport } from "../../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "../../../../model/common/contexts/dirty-check-context";

type MicroserviceDiagramWrapperProps = {
  onMicroserviceDeleted: (microserviceId: string) => any;
};

export const MicroserviceDiagramWrapper: FC<MicroserviceDiagramWrapperProps> = ({
  onMicroserviceDeleted,
}) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const microserviceDiagram = projectDefinition.microservices;

  const { setMicroserviceId } = useMicroserviceContext();

  useEffect(() => {
    setMicroserviceId("");
  }, []);

  return (
    <DirtyCheckContextProvider>
      <MicroservicesDiagram
        nodes={microserviceDiagram.nodes}
        edges={microserviceDiagram.edges}
        viewport={microserviceDiagram.viewport || defaultViewport}
        onMicroserviceDeleted={onMicroserviceDeleted}
      />
    </DirtyCheckContextProvider>
  );
};
