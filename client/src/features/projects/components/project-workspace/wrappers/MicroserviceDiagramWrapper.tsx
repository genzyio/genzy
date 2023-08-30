import { type FC, useEffect } from "react";
import { defaultViewport, useProjectContext } from "../../../contexts/project.context";
import { useMicroserviceContext } from "../../../../model/microservices/MicroserviceContext";
import { MicroservicesDiagram } from "../../../../model/microservices/MicroservicesDiagram";

export const MicroserviceDiagramWrapper: FC = () => {
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
    />
  );
};
