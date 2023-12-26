import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

export type State = "ADDED" | "MODIFIED" | "REMOVED";

type ChangeTrackerValues = {
  states: Record<string, State>;
  isMSInState: (id: string, state: State) => boolean;
  setStateForMS: (id: string, state: State) => any;
  resetStates: (newStates?: Record<string, State>) => any;
};

const initialChangeTrackerValues: ChangeTrackerValues = {
  states: {},
  isMSInState: () => false,
  setStateForMS: () => {},
  resetStates: () => {},
};

const ChangeTrackerContext = createContext<ChangeTrackerValues | null>(null);

export const useChangeTrackerContext = () => useContext(ChangeTrackerContext);

export const ChangeTrackerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [states, setStates] = useState<Record<string, State>>(initialChangeTrackerValues.states);

  const isMSInState = useCallback(
    (id: string, state: State) => {
      return states[id] === state;
    },
    [states]
  );

  const setStateForMS = useCallback(
    (id: string, state: string) => {
      if (!id) return;

      switch (state) {
        case "REMOVED": {
          setStates((currentStates) => {
            const currentState = currentStates[id];
            if (currentState === "ADDED") {
              delete currentStates[id];
              return { ...currentStates };
            } else {
              return {
                ...currentStates,
                [id]: "REMOVED",
              };
            }
          });
          break;
        }

        case "MODIFIED": {
          setStates((currentStates) => {
            const currentState = currentStates[id];
            if (["ADDED", "REMOVED"].includes(currentState)) {
              return { ...currentStates };
            } else {
              return {
                ...currentStates,
                [id]: "MODIFIED",
              };
            }
          });
          break;
        }

        case "ADDED": {
          setStates((currentStates) => {
            return {
              ...currentStates,
              [id]: "ADDED",
            };
          });
        }
      }
    },
    [states, setStates]
  );

  const resetStates = useCallback(
    (newStates: Record<string, State> = {}) => {
      setStates({ ...newStates });
    },
    [setStates]
  );

  useEffect(() => {
    console.log(states);
  }, [states]);

  return (
    <ChangeTrackerContext.Provider value={{ states, isMSInState, setStateForMS, resetStates }}>
      {children}
    </ChangeTrackerContext.Provider>
  );
};
