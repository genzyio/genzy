import { type FC } from "react";
import { Button } from "../../../../components/button";
import { useNotifications } from "../../../../hooks/useNotifications";
import { useProjectContext } from "../../contexts/project.context";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { useAction } from "../../../../hooks/useAction";
import { type SaveProjectDefinition } from "../../api/project.contracts";
import { saveProjectDefinition } from "../../api/project-definition.actions";
import { saveProjectScreenshot } from "../../api/project-screenshots.actions";
import { extractErrorMessage } from "../../../../utils/errors";
import { useProjectNavigation } from "../../hooks/useProjectNavigation";
import { useAutoSaveContext } from "../../contexts/auto-save.context";
import { useDirtyCheckContext } from "../../../model/common/contexts/dirty-check-context";
import { useChangeTrackerContext } from "../../contexts/change-tracker-context";

export const ProjectToolbar: FC = () => {
  const notificator = useNotifications();
  const { project } = useProjectContext();
  const { closeProject } = useProjectNavigation();
  const { isDirty, setInitialState } = useDirtyCheckContext();
  const { shouldAutoSave, toggleAutoSave, lastAutoSave } = useAutoSaveContext();
  const { projectDefinition: initialProjectDefinition } = useProjectDefinitionContext();
  const { states, resetStates } = useChangeTrackerContext();

  const saveProjectDefinitionAction = useAction<SaveProjectDefinition>(
    saveProjectDefinition(project.name),
    {
      onSuccess: () => {
        notificator.success("Project is saved.");
        setInitialState(false);
        saveProjectScreenshot(project.name);
        resetStates();
      },
      onError: (error) => {
        notificator.error(extractErrorMessage(error));
      },
    }
  );

  const saveAndCloseProjectDefinitionAction = useAction<SaveProjectDefinition>(
    saveProjectDefinition(project.name),
    {
      onSuccess: () => {
        notificator.success("Project is saved.");
        setInitialState(false);
        saveProjectScreenshot(project.name);
        resetStates();

        setTimeout(() => {
          closeProject();
        }, 10);
      },
      onError: (error) => {
        notificator.error(extractErrorMessage(error));
      },
    }
  );

  return (
    <>
      <div className="w-fit absolute top-4 z-10 select-none left-1/2 -translate-x-1/2">
        <div className="w-fit flex items-center gap-x-2 py-2 px-4 border rounded-md border-gray-100">
          <Button
            disabled={!isDirty}
            onClick={() => {
              saveProjectDefinitionAction({ projectDefinition: initialProjectDefinition, states });
            }}
            className="text-xs"
          >
            Save
          </Button>
          <Button
            disabled={!isDirty}
            onClick={() =>
              saveAndCloseProjectDefinitionAction({
                projectDefinition: initialProjectDefinition,
                states,
              })
            }
            className="text-xs"
          >
            Save And Close
          </Button>
          <Button onClick={closeProject} className="text-xs">
            Close
          </Button>

          <div className="border-r h-6 border-gray-300 mx-2"></div>

          <Button onClick={toggleAutoSave} className="text-xs">
            Auto Save: {shouldAutoSave ? "ON" : "OFF"}
          </Button>

          <div className="border-r h-6 border-gray-300 mx-2"></div>

          <div id="toolbar-actions"></div>
        </div>
      </div>

      {shouldAutoSave && lastAutoSave ? (
        <div className="absolute top-4 z-10 right-2">Last saved: {lastAutoSave.fromNow()}</div>
      ) : (
        <></>
      )}
    </>
  );
};
