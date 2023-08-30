import { type FC, useEffect } from "react";
import { defaultViewport, useProjectContext } from "../../../contexts/project.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { useTypesContext } from "../../../../model/class/TypesContext";
import { ServiceDiagram } from "../../../../model/service/ServiceDiagram";

export const ServiceDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectContext();
  const { setMicroserviceId } = useMicroserviceContext();
  const { types, updateTypes } = useTypesContext(microserviceId);
  const serviceDiagram = projectDefinition.services[microserviceId];

  useEffect(() => {
    setMicroserviceId(microserviceId);

    return () => setMicroserviceId("");
  }, []);

  useEffect(() => {
    if (types.length) return;
    updateTypes(projectDefinition.classes[microserviceId]?.nodes ?? []);
  }, []);

  return (
    <ServiceDiagram
      microserviceId={microserviceId}
      nodes={serviceDiagram.nodes}
      edges={serviceDiagram.edges}
      viewport={serviceDiagram.viewport || defaultViewport}
    />
  );
};
