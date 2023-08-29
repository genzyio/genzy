import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Project } from "../models/project.models";
import { type ProjectDefinition } from "../models/project-definition.models";
import { useProject } from "../hooks/useProjects";
import { useProjectDefinition } from "../hooks/useProjectDefinition";

type ProjectContextValues = {
  project: Project;
  projectDefinition: ProjectDefinition;

  addMicroservice: (microserviceId: string) => any;

  loadProject: (projectName: string) => any;
  closeProject: () => any;
};

const initialProjectContextValues: ProjectContextValues = {
  project: { name: "", path: "", createdAt: "" },
  projectDefinition: {
    microservices: {
      nodes: [],
      edges: [],
    },
    services: {},
    classes: {},
  },

  addMicroservice: () => {},

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

  const addMicroservice = (microserviceId) => {
    projectDefinition.services[microserviceId] = { nodes: [], edges: [] };
    projectDefinition.classes[microserviceId] = { nodes: [] };
  };

  if (isFetchingProject || isFetchedProjectDefinition) {
    return <></>;
  }

  return (
    <ProjectContext.Provider
      key={project?.name ?? ""}
      value={{
        project,
        projectDefinition,

        addMicroservice,

        loadProject: setProjectName,
        closeProject: () => setProjectName(""),
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
