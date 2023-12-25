import { ProjectContextProvider } from "./contexts/project.context";
import { ProjectDefinitionContextProvider } from "./contexts/project-definition.context";
import { Project } from "./components/project";
import { AutoSaveContextProvider } from "./contexts/auto-save.context";
import { DirtyCheckContextProvider } from "@features/diagrams/common/contexts/dirty-check-context";
import { ChangeTrackerContextProvider } from "./contexts/change-tracker-context";
import { WatchModeContextProvider } from "./contexts/watch-mode.context";
import { useParams } from "react-router-dom";

export function ProjectWorkspace() {
  const urlParams = useParams();
  const { projectName } = urlParams;

  return (
    <div className="h-full w-full">
      <ProjectContextProvider key={projectName} projectName={projectName}>
        <DirtyCheckContextProvider>
          <ChangeTrackerContextProvider>
            <AutoSaveContextProvider>
              <WatchModeContextProvider>
                <ProjectDefinitionContextProvider>
                  <Project />
                </ProjectDefinitionContextProvider>
              </WatchModeContextProvider>
            </AutoSaveContextProvider>
          </ChangeTrackerContextProvider>
        </DirtyCheckContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
