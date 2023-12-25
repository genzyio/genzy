import { type FC } from "react";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { MicroservicesDiagram } from "@features/diagrams/microservices/MicroservicesDiagram";
import { defaultViewport } from "../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "@features/diagrams/common/contexts/dirty-check-context";
import { MicroserviceContextProvider } from "@features/diagrams/common/contexts/microservice.context";

type MicroserviceDiagramWrapperProps = {
  onMicroserviceDeleted: (microserviceId: string) => any;
};

export const MicroserviceDiagramWrapper: FC<MicroserviceDiagramWrapperProps> = ({
  onMicroserviceDeleted,
}) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const microserviceDiagram = projectDefinition.microservices;

  return (
    <MicroserviceContextProvider microserviceId="">
      <DirtyCheckContextProvider>
        <MicroservicesDiagram
          nodes={microserviceDiagram.nodes}
          edges={microserviceDiagram.edges}
          viewport={microserviceDiagram.viewport || defaultViewport}
          onMicroserviceDeleted={onMicroserviceDeleted}
        />
      </DirtyCheckContextProvider>
    </MicroserviceContextProvider>
  );
};
