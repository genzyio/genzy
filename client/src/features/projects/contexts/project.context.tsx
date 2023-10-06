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
import { useParams } from "react-router-dom";
import { useProjectNavigation } from "../hooks/useProjectNavigation";

type ProjectContextValues = {
  project: Project;
  isOpened: boolean;
};

const initialProjectContextValues: ProjectContextValues = {
  project: { name: "", path: "", createdAt: "" },
  isOpened: false,
};

const ProjectContext = createContext<ProjectContextValues | null>(null);

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const urlParams = useParams();
  const { closeProject } = useProjectNavigation();

  const [projectName, setProjectName] = useState(initialProjectContextValues.project.name);
  const { project, isFetching, isError } = useProject(projectName);
  const isOpened = !!projectName && Object.keys(project).length > 0;

  useEffect(() => {
    const { projectName: initialProjectName } = urlParams;
    if (!initialProjectName) return;

    setProjectName(initialProjectName);
  }, [urlParams]);

  useEffect(() => {
    if (!isError) return;
    closeProject();
  }, [isError]);

  if (isFetching || isError) {
    return <></>;
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
