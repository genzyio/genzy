import { ProjectContextProvider } from "./features/projects/contexts/project.context";
import { ProjectDefinitionContextProvider } from "./features/projects/contexts/project-definition.context";
import { Project } from "./features/projects/components/project-workspace/project";

export function ProjectWorkspace() {
  return (
    <div className="h-full w-full">
      <div className="w-full h-[90%]">
        <ProjectContextProvider>
          <ProjectDefinitionContextProvider>
            <Project />
          </ProjectDefinitionContextProvider>
        </ProjectContextProvider>
      </div>
    </div>
  );
}
