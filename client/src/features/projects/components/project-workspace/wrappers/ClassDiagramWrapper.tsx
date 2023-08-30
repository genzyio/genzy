import { type FC, useEffect } from "react";
import { defaultViewport, useProjectContext } from "../../../contexts/project.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { ClassDiagram } from "../../../../model/class/ClassDiagram";

export const ClassDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectContext();
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
