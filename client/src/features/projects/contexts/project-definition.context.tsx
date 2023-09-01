import { type FC, type PropsWithChildren, createContext, useContext } from "react";
import { type ProjectDefinition } from "../models/project-definition.models";
import { type DispatcherType, createDispatcher } from "./project-definition.dispatcher";
import { useProjectDefinition } from "../hooks/useProjectDefinition";
import { useProjectContext } from "./project.context";

type ProjectDefinitionContextValues = {
  projectDefinition: ProjectDefinition;
  dispatcher: DispatcherType;
};

const initialProjectDefinitionContextValues: ProjectDefinitionContextValues = {
  projectDefinition: {
    microservices: {
      nodes: [],
      edges: [],
      viewport: {},
    },
    services: {},
    classes: {},
  },
  dispatcher: () => {},
};

const ProjectDefinitionContext = createContext<ProjectDefinitionContextValues>(
  initialProjectDefinitionContextValues
);

export const useProjectDefinitionContext = () => useContext(ProjectDefinitionContext);

export const ProjectDefinitionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { project } = useProjectContext();
  const { projectDefinition, isFetching } = useProjectDefinition(project?.name);
  const dispatcher = createDispatcher(projectDefinition);

  if (isFetching) {
    return <></>;
  }

  return (
    <ProjectDefinitionContext.Provider
      key={project?.name ?? ""}
      value={{
        projectDefinition,
        dispatcher,
      }}
    >
      {children}
    </ProjectDefinitionContext.Provider>
  );
};
