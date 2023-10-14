import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { useProjectContext } from "./project.context";
import { useAction } from "../../../hooks/useAction";
import { startProject, stopProject } from "../api/watch-project.actions";
import { useActiveMicroservices } from "../hooks/useActiveMicroservices";

type WatchModeValues = {
  watchModeEnabled: boolean;
  togglingWatchMode: boolean;
  toggleWatchMode: () => any;
  isMicroserviceActive: (microserviceId: string) => boolean;
};

const initialWatchModeValues: WatchModeValues = {
  watchModeEnabled: false,
  togglingWatchMode: false,
  toggleWatchMode: () => {},
  isMicroserviceActive: () => false,
};

const WatchModeContext = createContext<WatchModeValues | null>(null);

export const useWatchModeContext = () => useContext(WatchModeContext);

export const WatchModeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { project } = useProjectContext();
  const [watchModeEnabled, setWatchModeEnabled] = useState<boolean>(
    initialWatchModeValues.watchModeEnabled
  );
  const [togglingWatchMode, setTogglingWatchMode] = useState(false);

  const { activeMicroservices: initialActiveMicroservices, isFetching } = useActiveMicroservices(
    project.name
  );
  const [activeMicroservices, setActiveMicroservices] = useState<string[]>([]);

  useEffect(() => {
    if (isFetching || !initialActiveMicroservices) return;

    setActiveMicroservices(initialActiveMicroservices);
    setWatchModeEnabled(!!Object.keys(initialActiveMicroservices).length);
  }, [initialActiveMicroservices, isFetching]);

  const onExecutedAction = () => {
    setWatchModeEnabled((isEnabled) => !isEnabled);
    setTogglingWatchMode(false);
  };

  const startProjectAction = useAction<string>(startProject, {
    onSuccess: (activeMicroservices) => {
      onExecutedAction();
      setActiveMicroservices(activeMicroservices);
    },
    onError: () => {
      onExecutedAction();
      setActiveMicroservices([]);
    },
  });

  const stopProjectAction = useAction<string>(stopProject, {
    onSuccess: (activeMicroservices) => {
      onExecutedAction();
      setActiveMicroservices(activeMicroservices);
    },
    onError: () => {
      onExecutedAction();
      setActiveMicroservices([]);
    },
  });

  const toggleWatchMode = () => {
    setTogglingWatchMode(true);
    if (watchModeEnabled) {
      stopProjectAction(project.name);
    } else {
      startProjectAction(project.name);
    }
  };

  const isMicroserviceActive = useCallback(
    (microserviceId: string) => {
      return activeMicroservices.includes(microserviceId);
    },
    [activeMicroservices]
  );

  return (
    <WatchModeContext.Provider
      value={{ watchModeEnabled, toggleWatchMode, togglingWatchMode, isMicroserviceActive }}
    >
      {children}
    </WatchModeContext.Provider>
  );
};
