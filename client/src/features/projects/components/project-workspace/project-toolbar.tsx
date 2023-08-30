import { type FC } from "react";
import { Button } from "../../../../components/button";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useProjectContext } from "../../contexts/project.context";
import { useAction } from "../../../../hooks/useAction";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { saveProjectDefinition } from "../../api/project-definition.actions";
import { saveProjectScreenshot } from "../../api/project-screenshots.actions";
import { extractErrorMessage } from "../../../../utils/errors";

export const ProjectToolbar: FC = () => {
  const notificator = useNotifications();
  const {
    project,
    projectDefinition: initialProjectDefinition,
    closeProject,
  } = useProjectContext();

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

  return (
    <div className="flex gap-x-2">
      <Button
        onClick={() => {
          saveProjectDefinitionAction(initialProjectDefinition);
        }}
      >
        Save
      </Button>
      <Button onClick={() => saveAndCloseProjectDefinitionAction(initialProjectDefinition)}>
        Save And Close
      </Button>

      <Button onClick={closeProject}>Close</Button>
    </div>
  );
};
