import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Project } from "../models/project.models";
import { type ProjectDefinition } from "../models/project-definition.models";
import { useProject } from "../hooks/useProjects";
import { useProjectDefinition } from "../hooks/useProjectDefinition";

type ProjectContextValues = {
  project: Project;
  projectDefinition: ProjectDefinition;
  loadProject: (projectName: string) => any;
  closeProject: () => any;
};

const initialProjectContextValues: ProjectContextValues = {
  project: { name: "", path: "", createdAt: "" },
  projectDefinition: {
    nodes: [],
    edges: [],
    microservices: {
      nodes: [],
      edges: [],
    },
    classes: {
      nodes: [],
    },
  },
  loadProject: () => {},
  closeProject: () => {},
};

const ProjectContext = createContext<ProjectContextValues | null>(null);

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectName, setProjectName] = useState(initialProjectContextValues.project.name);

  const { project, isFetching: isFetchingProject } = useProject(projectName);
  const { projectDefinition, isFetching: isFetchedProjectDefinition } =
    useProjectDefinition(projectName);

  if (isFetchingProject || isFetchedProjectDefinition) {
    return <></>;
  }

  return (
    <ProjectContext.Provider
      key={project?.name ?? ""}
      value={{
        project,
        projectDefinition,
        loadProject: setProjectName,
        closeProject: () => setProjectName(""),
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
