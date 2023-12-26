import moment from "moment";
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type ProjectDefinition } from "../models/project-definition.models";
import { type SaveProjectDefinition } from "../api/project-definition.contracts";
import { useProjectContext } from "./project.context";
import { useDebounce } from "@uidotdev/usehooks";
import { useAction } from "@core/hooks/useAction";
import { saveProjectDefinition } from "../api/project-definition.actions";
import { saveProjectScreenshot } from "@features/projects/api/project-screenshots.actions";
import { useDirtyCheckContext } from "@features/diagrams/common/contexts/dirty-check.context";
import { useChangeTrackerContext } from "./change-tracker.context";
import { isValidProject } from "../utils/validations";

type AutoSaveContextValues = {
  shouldAutoSave: boolean;
  lastAutoSave: any;
  resetAutoSave: () => void;
  toggleAutoSave: () => void;
  triggerAutoSave: (projectDefinition: ProjectDefinition) => void;
};

const initialAutoSaveContextValues: AutoSaveContextValues = {
  shouldAutoSave: false,
  lastAutoSave: null,
  resetAutoSave: () => {},
  toggleAutoSave: () => {},
  triggerAutoSave: () => {},
};

const AutoSaveContext = createContext<AutoSaveContextValues>(initialAutoSaveContextValues);

export const useAutoSaveContext = () => useContext(AutoSaveContext);

const useAutoSavePreferences = (projectName: string) => {
  const localStorageKey = `${projectName}/auto-save`;

  return {
    get: (): boolean => localStorage.getItem(localStorageKey) === "true",
    store: (autoSave: boolean): void => localStorage.setItem(localStorageKey, autoSave.toString()),
  };
};

export const AutoSaveContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { project } = useProjectContext();
  const { setInitialState } = useDirtyCheckContext();
  const { states, resetStates } = useChangeTrackerContext();

  const autoSavePreferences = useAutoSavePreferences(project.name);
  const [shouldAutoSave, setShouldAutoSave] = useState(
    autoSavePreferences.get() || initialAutoSaveContextValues.shouldAutoSave
  );
  const [lastAutoSave, setLastAutoSave] = useState<any>(initialAutoSaveContextValues.lastAutoSave);

  const [projectDefinitionToSave, setProjectDefinitionToSave] = useState(null);
  const projectDefinitionToSaveDebounced = useDebounce(projectDefinitionToSave, 10000);

  const resetAutoSave = useCallback(() => {
    setProjectDefinitionToSave(undefined);
  }, [setProjectDefinitionToSave]);

  const toggleAutoSave = useCallback(() => {
    setShouldAutoSave((shouldAutoSave) => {
      autoSavePreferences.store(!shouldAutoSave);
      return !shouldAutoSave;
    });
    setProjectDefinitionToSave(null);
    setLastAutoSave(null);
  }, [setShouldAutoSave]);

  const triggerAutoSave = useCallback(
    (projectDefinition: ProjectDefinition) => {
      if (!shouldAutoSave) return;

      setProjectDefinitionToSave({ ...projectDefinition });
    },
    [shouldAutoSave, setProjectDefinitionToSave]
  );

  const saveProjectDefinitionAction = useAction<SaveProjectDefinition>(
    saveProjectDefinition(project.name),
    {
      onSuccess: () => {
        setInitialState(false);
        saveProjectScreenshot(project.name);
        resetStates();
        setLastAutoSave(moment());
      },
      onError: () => {},
    }
  );

  useEffect(() => {
    if (!projectDefinitionToSaveDebounced || !shouldAutoSave) return;

    const [valid] = isValidProject(projectDefinitionToSaveDebounced, states);
    if (!valid) return;

    saveProjectDefinitionAction({ projectDefinition: projectDefinitionToSaveDebounced, states });
  }, [projectDefinitionToSaveDebounced]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastAutoSave) return;

      setLastAutoSave(moment(lastAutoSave?.toString()));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastAutoSave]);

  return (
    <AutoSaveContext.Provider
      value={{ shouldAutoSave, lastAutoSave, resetAutoSave, toggleAutoSave, triggerAutoSave }}
    >
      {children}
    </AutoSaveContext.Provider>
  );
};
