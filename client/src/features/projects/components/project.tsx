import { type FC, createRef } from "react";
import { Diagram } from "../../model/Diagram";
import { useProjectContext } from "../contexts/project.context";
import { saveProjectScreenshot } from "../api/project-screenshots.actions";
import { Button } from "../../../components/button";
import { useAction } from "../../../hooks/useAction";
import { type ProjectDefinition } from "../models/project-definition.models";
import { saveProjectDefinition } from "../api/project-definition.actions";
import { EmptyDiagram } from "../../model/EmptyDiagram";

// NOTE: Everything done with forwardRef is temporal solution
export const Project: FC = () => {
  const { project, projectDefinition } = useProjectContext();

  const diagramRef = createRef<any>();

  const saveProjectDefinitionAction = useAction<ProjectDefinition>(
    saveProjectDefinition(project.name),
    { onSuccess: () => {}, onError: () => {} }
  );

  const saveProject = () => {
    const projectDefinition = diagramRef.current?.getState();
    saveProjectDefinitionAction(projectDefinition);
    saveProjectScreenshot(project.name);
  };

  if (!project.name) {
    return <EmptyDiagram />;
  }

  return (
    <>
      <Button onClick={saveProject}>Save Project</Button>

      <Diagram ref={diagramRef} {...projectDefinition} />
    </>
  );
};
