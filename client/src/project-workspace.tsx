import { ProjectContextProvider } from "./features/projects/contexts/project.context";
import { ProjectDefinitionContextProvider } from "./features/projects/contexts/project-definition.context";
import { Project } from "./features/projects/components/project-workspace/project";
import { AutoSaveContextProvider } from "./features/projects/contexts/auto-save.context";

export function ProjectWorkspace() {
  return (
    <div className="h-full w-full">
      <ProjectContextProvider>
        <AutoSaveContextProvider>
          <ProjectDefinitionContextProvider>
            <Project />
          </ProjectDefinitionContextProvider>
        </AutoSaveContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
