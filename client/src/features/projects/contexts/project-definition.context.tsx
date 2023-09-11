import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { type ProjectDefinition } from "../models/project-definition.models";
import { type DispatcherType, createDispatcher } from "./project-definition.dispatcher";
import { useProjectDefinition } from "../hooks/useProjectDefinition";
import { useProjectContext } from "./project.context";
import { useAutoSaveContext } from "./auto-save.context";

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
  const { triggerAutoSave } = useAutoSaveContext();

  const { projectDefinition, isFetching } = useProjectDefinition(project?.name);
  const dispatcher = useMemo(() => createDispatcher(projectDefinition), [projectDefinition]);
  const autoSaveDispatcher = useCallback(
    (type: symbol, payload: any) => {
      const result = dispatcher(type, payload);

      setTimeout(() => {
        triggerAutoSave(projectDefinition);
      }, 1000);

      return result;
    },
    [dispatcher, triggerAutoSave]
  );

  if (isFetching) {
    return <></>;
  }

  return (
    <ProjectDefinitionContext.Provider
      key={project?.name ?? ""}
      value={{
        projectDefinition,
        dispatcher: autoSaveDispatcher,
      }}
    >
      {children}
    </ProjectDefinitionContext.Provider>
  );
};
