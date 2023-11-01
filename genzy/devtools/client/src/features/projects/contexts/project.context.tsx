import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { type Project } from "../models/project.models";
import { useProject } from "../hooks/useProjects";
import { useProjectNavigation } from "../hooks/useProjectNavigation";
import { EmptyDiagram } from "../../model/EmptyDiagram";

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
