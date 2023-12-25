import { type FC } from "react";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { MicroserviceContextProvider } from "@features/diagrams/common/contexts/microservice.context";
import { ClassDiagram } from "@features/diagrams/class/ClassDiagram";
import { defaultViewport } from "../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "@features/diagrams/common/contexts/dirty-check-context";

export const ClassDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const classDiagram = projectDefinition.classes[microserviceId];

  return (
    <MicroserviceContextProvider microserviceId={microserviceId}>
      <DirtyCheckContextProvider>
        <ClassDiagram
          microserviceId={microserviceId}
          nodes={classDiagram.nodes}
          edges={classDiagram.edges}
          viewport={classDiagram.viewport || defaultViewport}
        />
      </DirtyCheckContextProvider>
    </MicroserviceContextProvider>
  );
};
