import { type FC } from "react";
import { Button } from "../../../../components/button";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useProjectContext } from "../../contexts/project.context";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { useAction } from "../../../../hooks/useAction";
import { type ProjectDefinition } from "../../models/project-definition.models";
import { saveProjectDefinition } from "../../api/project-definition.actions";
import { saveProjectScreenshot } from "../../api/project-screenshots.actions";
import { extractErrorMessage } from "../../../../utils/errors";
import { useProjectNavigation } from "../../hooks/useProjectNavigation";

export const ProjectToolbar: FC = () => {
  const notificator = useNotifications();
  const { project } = useProjectContext();
  const { closeProject } = useProjectNavigation();
  const { projectDefinition: initialProjectDefinition } = useProjectDefinitionContext();

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
    <div className="flex absolute w-full justify-center top-4 z-10">
      <div className="flex items-center gap-x-2 py-2 px-4 border rounded-md border-gray-100">
        <Button
          onClick={() => {
            saveProjectDefinitionAction(initialProjectDefinition);
          }}
          className="text-xs px-1 py-1"
        >
          Save
        </Button>
        <Button
          onClick={() => saveAndCloseProjectDefinitionAction(initialProjectDefinition)}
          className="text-xs px-1 py-1"
        >
          Save And Close
        </Button>
        <Button onClick={closeProject} className="text-xs px-1 py-1">
          Close
        </Button>

        <div className="border-r h-6 border-gray-300 mx-2"></div>

        <div id="toolbar-actions"></div>
      </div>
    </div>
  );
};
