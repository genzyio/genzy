import { ProjectContextProvider } from "./features/projects/contexts/project.context";
import { ProjectDefinitionContextProvider } from "./features/projects/contexts/project-definition.context";
import { Project } from "./features/projects/components/project-workspace/project";
import { AutoSaveContextProvider } from "./features/projects/contexts/auto-save.context";
import { DirtyCheckContextProvider } from "./features/model/common/contexts/dirty-check-context";
import { ChangeTrackerContextProvider } from "./features/projects/contexts/change-tracker-context";

export function ProjectWorkspace() {
  return (
    <div className="h-full w-full">
      <ProjectContextProvider>
        <DirtyCheckContextProvider>
          <ChangeTrackerContextProvider>
            <AutoSaveContextProvider>
              <ProjectDefinitionContextProvider>
                <Project />
              </ProjectDefinitionContextProvider>
            </AutoSaveContextProvider>
          </ChangeTrackerContextProvider>
        </DirtyCheckContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
