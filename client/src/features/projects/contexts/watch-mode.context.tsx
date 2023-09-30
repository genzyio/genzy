import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useProjectContext } from "./project.context";
import { useAction } from "../../../hooks/useAction";
import { startProject, stopProject } from "../api/watch-project.actions";

type WatchModeValues = {
  watchModeEnabled: boolean;
  togglingWatchMode: boolean;
  toggleWatchMode: () => any;
};

const initialWatchModeValues: WatchModeValues = {
  watchModeEnabled: false,
  togglingWatchMode: false,
  toggleWatchMode: () => {},
};

const WatchModeContext = createContext<WatchModeValues | null>(null);

export const useWatchModeContext = () => useContext(WatchModeContext);

export const WatchModeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { project } = useProjectContext();
  const [watchModeEnabled, setWatchModeEnabled] = useState<boolean>(
    initialWatchModeValues.watchModeEnabled
  );
  const [togglingWatchMode, setTogglingWatchMode] = useState(false);

  const toggleEnabled = useCallback(() => {
    setWatchModeEnabled((isEnabled) => !isEnabled);
  }, [setWatchModeEnabled]);

  const onExecutedAction = () => {
    toggleEnabled();
    setTogglingWatchMode(false);
  };

  const startProjectAction = useAction<string>(startProject, {
    onSuccess: onExecutedAction,
    onError: onExecutedAction,
  });

  const stopProjectAction = useAction<string>(stopProject, {
    onSuccess: onExecutedAction,
    onError: onExecutedAction,
  });

  const toggleWatchMode = () => {
    setTogglingWatchMode(true);
    if (watchModeEnabled) {
      stopProjectAction(project.name);
    } else {
      startProjectAction(project.name);
    }
  };

  return (
    <WatchModeContext.Provider value={{ watchModeEnabled, toggleWatchMode, togglingWatchMode }}>
      {children}
    </WatchModeContext.Provider>
  );
};
