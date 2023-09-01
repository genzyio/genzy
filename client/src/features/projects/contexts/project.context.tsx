import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Project } from "../models/project.models";
import { useProject } from "../hooks/useProjects";

type ProjectContextValues = {
  project: Project;
  isOpened: boolean;
  loadProject: (projectName: string) => any;
  closeProject: () => any;
};

const initialProjectContextValues: ProjectContextValues = {
  project: { name: "", path: "", createdAt: "" },
  isOpened: false,
  loadProject: () => {},
  closeProject: () => {},
};

const ProjectContext = createContext<ProjectContextValues | null>(null);

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectName, setProjectName] = useState(initialProjectContextValues.project.name);
  const isOpened = !!projectName;

  const { project, isFetching } = useProject(projectName);

  if (isFetching) {
    return <></>;
  }

  return (
    <ProjectContext.Provider
      key={project?.name ?? ""}
      value={{
        project,
        isOpened,
        loadProject: setProjectName,
        closeProject: () => setProjectName(""),
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
