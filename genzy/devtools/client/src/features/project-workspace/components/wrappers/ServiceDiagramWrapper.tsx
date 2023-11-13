import { type FC, useEffect } from "react";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { MicroserviceContextProvider } from "../../../diagrams/common/contexts/microservice.context";
import { useTypesContext } from "../../../diagrams/class/TypesContext";
import { ServiceDiagram } from "../../../diagrams/service/ServiceDiagram";
import { defaultViewport } from "../../contexts/project-definition-handlers/microservice-handlers";
import { DirtyCheckContextProvider } from "../../../diagrams/common/contexts/dirty-check-context";

export const ServiceDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { types, updateTypes } = useTypesContext(microserviceId);
  const serviceDiagram = projectDefinition.services[microserviceId];

  useEffect(() => {
    if (types.length) return;
    updateTypes(projectDefinition.classes[microserviceId]?.nodes ?? []);
  }, []);

  return (
    <MicroserviceContextProvider microserviceId={microserviceId}>
      <DirtyCheckContextProvider>
        <ServiceDiagram
          microserviceId={microserviceId}
          nodes={serviceDiagram.nodes}
          edges={serviceDiagram.edges}
          viewport={serviceDiagram.viewport || defaultViewport}
        />
      </DirtyCheckContextProvider>
    </MicroserviceContextProvider>
  );
};
