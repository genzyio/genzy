import { type FC, createRef } from "react";
import { Diagram } from "../../model/Diagram";
import { useProjectContext } from "../contexts/project.context";
import { saveProjectScreenshot } from "../api/project-screenshots.actions";
import { Button } from "../../../components/button";
import { useAction } from "../../../hooks/useAction";
import { type ProjectDefinition } from "../models/project-definition.models";
import { saveProjectDefinition } from "../api/project-definition.actions";
import { EmptyDiagram } from "../../model/EmptyDiagram";
import { useNotifications } from "../../../hooks/useNotifications";
import { extractErrorMessage } from "../../../utils/errors";

// NOTE: Everything done with forwardRef is temporal solution
export const Project: FC = () => {
  const notificator = useNotifications();
  const {
    project,
    projectDefinition: initialProjectDefinition,
    closeProject,
  } = useProjectContext();

  const diagramRef = createRef<any>();

  const saveProjectDefinitionAction = useAction<ProjectDefinition>(
    saveProjectDefinition(project.name),
    {
      onSuccess: () => {
        notificator.success("Project is saved.");
        saveProjectScreenshot(project.name);
      },
      onError: (error) => {
        notificator.error(extractErrorMessage(error));
      },
    }
  );

  const saveAndCloseProjectDefinitionAction = useAction<ProjectDefinition>(
    saveProjectDefinition(project.name),
    {
      onSuccess: () => {
        notificator.success("Project is saved.");
        saveProjectScreenshot(project.name);
        closeProject();
      },
      onError: (error) => {
        notificator.error(extractErrorMessage(error));
      },
    }
  );

  if (!project.name) {
    return <EmptyDiagram />;
  }

  return (
    <>
      <div className="flex gap-x-2">
        <Button onClick={() => saveProjectDefinitionAction(diagramRef.current?.getState())}>
          Save
        </Button>
        <Button onClick={() => saveAndCloseProjectDefinitionAction(diagramRef.current?.getState())}>
          Save And Close
        </Button>
        <Button onClick={closeProject}>Close</Button>
      </div>

      <Diagram ref={diagramRef} {...initialProjectDefinition} />
    </>
  );
};
