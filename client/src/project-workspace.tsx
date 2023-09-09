import { ProjectContextProvider } from "./features/projects/contexts/project.context";
import { ProjectDefinitionContextProvider } from "./features/projects/contexts/project-definition.context";
import { Project } from "./features/projects/components/project-workspace/project";

export function ProjectWorkspace() {
  return (
    <div className="h-full w-full">
      <ProjectContextProvider>
        <ProjectDefinitionContextProvider>
          <Project />
        </ProjectDefinitionContextProvider>
      </ProjectContextProvider>
    </div>
  );
}
