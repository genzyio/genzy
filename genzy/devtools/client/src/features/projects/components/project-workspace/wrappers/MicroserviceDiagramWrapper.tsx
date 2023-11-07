import { type FC } from "react";
import { useProjectDefinitionContext } from "../../../contexts/project-definition.context";
import { MicroservicesDiagram } from "../../../../model/microservices/MicroservicesDiagram";
import { defaultViewport } from "../../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "../../../../model/common/contexts/dirty-check-context";
import { MicroserviceContextProvider } from "../../../../model/microservices/MicroserviceContext";

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
