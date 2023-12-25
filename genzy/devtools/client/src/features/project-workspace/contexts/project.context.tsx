import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Project } from "@features/projects/models/project.models";
import { useProject } from "@features/projects/hooks/useProjects";
import { useProjectNavigation } from "@features/projects/hooks/useProjectNavigation";
import { EmptyDiagram } from "@features/diagrams/EmptyDiagram";

type ProjectContextValues = {
  project: Project;
  isOpened: boolean;
};

const ProjectContext = createContext<ProjectContextValues | null>(null);

export const useProjectContext = () => useContext(ProjectContext);

type ProjectContextProviderProps = PropsWithChildren & {
  projectName: string;
};

export const ProjectContextProvider: FC<ProjectContextProviderProps> = ({
  projectName: initialProjectName,
  children,
}) => {
  const { closeProject } = useProjectNavigation();

  const [projectName] = useState(initialProjectName);
  const { project, isFetching, isError } = useProject(projectName);
  const isOpened = !!projectName && Object.keys(project).length > 0;

  if (isFetching) {
    return <EmptyDiagram />;
  }

  if (isError) {
    closeProject();
    return <EmptyDiagram />;
  }

  return (
    <ProjectContext.Provider
      key={project?.name ?? ""}
      value={{
        project,
        isOpened,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
