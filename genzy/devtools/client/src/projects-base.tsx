import { useProjectNavigation } from "./features/projects/hooks/useProjectNavigation";
import { useDefaultProject } from "./features/projects/hooks/useDefaultProject";
import { EmptyDiagram } from "./features/diagrams/EmptyDiagram";

export function ProjectsBase() {
  const { openProject, closeProject } = useProjectNavigation();
  const { defaultProject, isFetching } = useDefaultProject();

  if (isFetching) {
    return <EmptyDiagram />;
  }

  if (defaultProject) {
    openProject(defaultProject);
  } else {
    closeProject();
  }
}
