import { type FC, useEffect } from "react";
import { useProjectDefinitionContext } from "../../../contexts/project-definition.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { ClassDiagram } from "../../../../model/class/ClassDiagram";
import { defaultViewport } from "../../../contexts/project-definition-handlers/microservice-handlers";

export const ClassDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { setMicroserviceId } = useMicroserviceContext();
  const classDiagram = projectDefinition.classes[microserviceId];

  useEffect(() => {
    setMicroserviceId(microserviceId);

    return () => setMicroserviceId("");
  }, []);

  return (
    <ClassDiagram
      microserviceId={microserviceId}
      nodes={classDiagram.nodes}
      viewport={classDiagram.viewport || defaultViewport}
    />
  );
};
