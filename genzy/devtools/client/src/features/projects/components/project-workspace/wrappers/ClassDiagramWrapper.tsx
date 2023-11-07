import { type FC } from "react";
import { useProjectDefinitionContext } from "../../../contexts/project-definition.context";
import { MicroserviceContextProvider } from "../../../../model/microservices/MicroserviceContext";
import { ClassDiagram } from "../../../../model/class/ClassDiagram";
import { defaultViewport } from "../../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "../../../../model/common/contexts/dirty-check-context";

export const ClassDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const classDiagram = projectDefinition.classes[microserviceId];

  return (
    <MicroserviceContextProvider microserviceId={microserviceId}>
      <DirtyCheckContextProvider>
        <ClassDiagram
          microserviceId={microserviceId}
          nodes={classDiagram.nodes}
          viewport={classDiagram.viewport || defaultViewport}
        />
      </DirtyCheckContextProvider>
    </MicroserviceContextProvider>
  );
};
