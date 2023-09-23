import { ProjectContextProvider } from "./features/projects/contexts/project.context";
import { ProjectDefinitionContextProvider } from "./features/projects/contexts/project-definition.context";
import { Project } from "./features/projects/components/project-workspace/project";
import { AutoSaveContextProvider } from "./features/projects/contexts/auto-save.context";
import { DirtyCheckContextProvider } from "./features/model/common/contexts/dirty-check-context";

export function ProjectWorkspace() {
  return (
    <div className="h-full w-full">
      <ProjectContextProvider>
        <DirtyCheckContextProvider>
          <AutoSaveContextProvider>
            <ProjectDefinitionContextProvider>
              <Project />
            </ProjectDefinitionContextProvider>
          </AutoSaveContextProvider>
        </DirtyCheckContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
