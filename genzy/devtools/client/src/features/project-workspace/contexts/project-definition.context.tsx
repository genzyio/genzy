import {
  type FC,
  type PropsWithChildren,
  type SetStateAction,
  type Dispatch,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { type ProjectDefinition } from "../models/project-definition.models";
import { type DispatcherType, createDispatcher } from "./project-definition.dispatcher";
import { useProjectDefinition } from "../hooks/useProjectDefinition";
import { useProjectContext } from "./project.context";
import { useAutoSaveContext } from "./auto-save.context";
import { useChangeTrackerContext } from "./change-tracker.context";
import { useDirtyCheckContext } from "@features/diagrams/common/contexts/dirty-check.context";
import { createChangeTrackingDispatcherWrapper } from "./change-tracker.dispatcher";
import { Button } from "@core/components/button";
import useUndoable from "use-undoable";
import { EmptyDiagram } from "@features/diagrams/empty-diagram";
import { useProjectNavigation } from "@features/projects/hooks/useProjectNavigation";

type ProjectDefinitionContextValues = {
  projectDefinition: ProjectDefinition;
  dispatcher: DispatcherType;
  setExecuteOnUndoRedo: Dispatch<SetStateAction<() => any>>;
};

const initialProjectDefinitionContextValues: ProjectDefinitionContextValues = {
  projectDefinition: {
    microservices: {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    services: {},
    classes: {},
  },
  dispatcher: async () => {},
  setExecuteOnUndoRedo: () => () => {},
};

const ProjectDefinitionContext = createContext<ProjectDefinitionContextValues>(
  initialProjectDefinitionContextValues
);

export const useProjectDefinitionContext = () => useContext(ProjectDefinitionContext);

export const ProjectDefinitionContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { project } = useProjectContext();
  const { closeProject } = useProjectNavigation();
  const { setCurrentState } = useDirtyCheckContext();
  const { triggerAutoSave } = useAutoSaveContext();
  const { setStateForMS } = useChangeTrackerContext();
  const { projectDefinition, isFetching, isError } = useProjectDefinition(project?.name);

  const [executeOnUndoRedo, setExecuteOnUndoRedo] = useState(() => () => {});

  const { undo, canUndo, redo, canRedo, shouldSaveNextUndoRedoState } =
    useUndoableProjectDefinition(projectDefinition, executeOnUndoRedo);

  const dispatcher = useMemo(() => createDispatcher(projectDefinition), [projectDefinition]);

  const changeTrackingDispatcher = useMemo(
    () => createChangeTrackingDispatcherWrapper(projectDefinition, dispatcher, setStateForMS),
    [projectDefinition, dispatcher, setStateForMS]
  );

  const multiLevelDispatcher = useCallback(
    async (type: symbol, payload: any) => {
      let result = await changeTrackingDispatcher(type, payload);
      while (typeof result === "function") {
        result = await result(multiLevelDispatcher);
      }
      return result;
    },
    [changeTrackingDispatcher]
  );

  const autoSaveDispatcher = useCallback(
    async (type: symbol, payload: any) => {
      const result = await multiLevelDispatcher(type, payload);
      shouldSaveNextUndoRedoState(true);
      setCurrentState(true);
      setTimeout(() => {
        triggerAutoSave(projectDefinition);
      }, 300);

      return result;
    },
    [multiLevelDispatcher, triggerAutoSave, shouldSaveNextUndoRedoState]
  );

  if (isFetching) {
    return <EmptyDiagram />;
  }

  if (isError) {
    closeProject();
    return <EmptyDiagram />;
  }

  return (
    <>
      <UndoRedoButtons undo={undo} canUndo={canUndo} redo={redo} canRedo={canRedo} />

      <ProjectDefinitionContext.Provider
        key={project?.name ?? ""}
        value={{
          projectDefinition,
          dispatcher: autoSaveDispatcher,
          setExecuteOnUndoRedo,
        }}
      >
        {children}
      </ProjectDefinitionContext.Provider>
    </>
  );
};

const useUndoableProjectDefinition = (
  projectDefinition: ProjectDefinition,
  executeOnUndoRedo: () => any
) => {
  const { states, resetStates } = useChangeTrackerContext();
  const { triggerAutoSave } = useAutoSaveContext();
  const { setCurrentState } = useDirtyCheckContext();

  const [shouldApplyUndoRedoOnProject, setShouldApplyUndoRedoOnProject] = useState(false);
  const [shouldSaveNextUndoRedoState, setShouldSaveNextUndoRedoState] = useState(false);
  const [undoState, setUndoState, { future, undo, canUndo, redo, canRedo, resetInitialState }] =
    useUndoable(undefined, {
      ignoreIdenticalMutations: false,
      cloneState: true,
      behavior: "mergePastReversed",
    });

  const getNextUndoState = () =>
    JSON.stringify({
      projectDefinition,
      states,
    });

  if (!undoState && Object.keys(projectDefinition).length) {
    const nextUndoState = getNextUndoState();
    setUndoState(nextUndoState);
    resetInitialState(nextUndoState);
  }

  useEffect(() => {
    if (!shouldSaveNextUndoRedoState) return;

    setUndoState(getNextUndoState());
    setShouldSaveNextUndoRedoState(false);
  }, [shouldSaveNextUndoRedoState, setShouldSaveNextUndoRedoState]);

  useEffect(() => {
    if (!shouldApplyUndoRedoOnProject) return;

    const { projectDefinition: olderProjectDefinition, states } = JSON.parse(undoState);
    const { states: statesBefore } = future.length ? JSON.parse(future[0]) : { states: {} };

    for (const [microserviceId, stateBefore] of Object.entries(statesBefore)) {
      const currentState = states[microserviceId];
      if (currentState) continue;

      if (stateBefore === "MODIFIED") states[microserviceId] = "MODIFIED";
      if (stateBefore === "ADDED") states[microserviceId] = "REMOVED";
      if (stateBefore === "REMOVED") states[microserviceId] = "ADDED";
    }

    resetStates(states);
    projectDefinition.classes = olderProjectDefinition.classes;
    projectDefinition.microservices = olderProjectDefinition.microservices;
    projectDefinition.services = olderProjectDefinition.services;
    triggerAutoSave(projectDefinition);
    setCurrentState(true);

    setShouldApplyUndoRedoOnProject(false);
    executeOnUndoRedo();
  }, [undoState, shouldApplyUndoRedoOnProject, setShouldApplyUndoRedoOnProject]);

  const applyUndoOnProject = useCallback(() => {
    undo();
    setShouldApplyUndoRedoOnProject(true);
  }, [undo, setShouldApplyUndoRedoOnProject]);

  const applyRedoOnProject = useCallback(() => {
    redo();
    setShouldApplyUndoRedoOnProject(true);
  }, [redo, setShouldApplyUndoRedoOnProject]);

  return {
    undo: applyUndoOnProject,
    canUndo,
    redo: applyRedoOnProject,
    canRedo,
    shouldSaveNextUndoRedoState: setShouldSaveNextUndoRedoState,
  };
};

type UndoRedoButtonsProps = {
  undo: () => any;
  canUndo: boolean;
  redo: () => any;
  canRedo: boolean;
};

const UndoRedoButtons: FC<UndoRedoButtonsProps> = ({ undo, canUndo, redo, canRedo }) => {
  const elem = document.getElementById("undo-redo-actions");

  return useMemo(() => {
    if (elem) {
      return createPortal(
        <div className="flex justify-center gap-x-2">
          <Button disabled={!canUndo} className="hover:opacity-60 text-xs px-1 py-1" onClick={undo}>
            Undo
          </Button>
          <Button disabled={!canRedo} className="hover:opacity-60 text-xs px-1 py-1" onClick={redo}>
            Redo
          </Button>
        </div>,
        elem
      );
    }
  }, [elem, undo, canUndo, redo, canRedo]);
};
