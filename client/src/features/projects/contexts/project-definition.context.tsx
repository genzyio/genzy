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
import { useChangeTrackerContext } from "./change-tracker-context";
import { useDirtyCheckContext } from "../../model/common/contexts/dirty-check-context";
import { createChangeTrackingDispatcherWrapper } from "./change-tracker.dispatcher";

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
  const { setCurrentState } = useDirtyCheckContext();
  const { triggerAutoSave } = useAutoSaveContext();
  const { setStateForMS } = useChangeTrackerContext();
  const { projectDefinition, isFetching } = useProjectDefinition(project?.name);

  const dispatcher = useMemo(() => createDispatcher(projectDefinition), [projectDefinition]);

  const changeTrackingDispatcher = useMemo(
    () => createChangeTrackingDispatcherWrapper(dispatcher, setStateForMS),
    [dispatcher, setStateForMS]
  );

  const multiLevelDispatcher = useCallback(
    (type: symbol, payload: any) => {
      let result = changeTrackingDispatcher(type, payload);
      while (typeof result === "function") {
        result = result(multiLevelDispatcher);
      }
      return result;
    },
    [changeTrackingDispatcher]
  );

  const autoSaveDispatcher = useCallback(
    (type: symbol, payload: any) => {
      const result = multiLevelDispatcher(type, payload);
      setCurrentState(true);
      setTimeout(() => {
        triggerAutoSave(projectDefinition);
      }, 300);

      return result;
    },
    [multiLevelDispatcher, triggerAutoSave]
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
