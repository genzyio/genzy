import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";
import { type Project } from "../models/project.models";
import { type ProjectDefinition } from "../models/project-definition.models";
import { useProject } from "../hooks/useProjects";
import { useProjectDefinition } from "../hooks/useProjectDefinition";

type ProjectContextValues = {
  project: Project;
  isOpened: boolean;
  projectDefinition: ProjectDefinition;

  addMicroservice: (microserviceId: string) => any;

  loadProject: (projectName: string) => any;
  closeProject: () => any;
};

const initialProjectContextValues: ProjectContextValues = {
  project: { name: "", path: "", createdAt: "" },
  isOpened: false,
  projectDefinition: {
    microservices: {
      nodes: [],
      edges: [],
      viewport: {},
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

export const defaultViewport = { x: 0, y: 0, zoom: 1 };

export const ProjectContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [projectName, setProjectName] = useState(initialProjectContextValues.project.name);
  const isOpened = !!projectName;

  const { project, isFetching: isFetchingProject } = useProject(projectName);
  const { projectDefinition, isFetching: isFetchedProjectDefinition } =
    useProjectDefinition(projectName);

  const addMicroservice = (microserviceId: string) => {
    projectDefinition.services[microserviceId] = {
      nodes: [],
      edges: [],
      viewport: defaultViewport,
    };
    projectDefinition.classes[microserviceId] = { nodes: [], viewport: defaultViewport };
  };

  if (isFetchingProject || isFetchedProjectDefinition) {
    return <></>;
  }

  return (
    <ProjectContext.Provider
      key={project?.name ?? ""}
      value={{
        project,
        isOpened,
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
