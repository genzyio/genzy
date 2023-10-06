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
  setStateForMS: (id: string, state: State) => any;
  resetStates: (newStates?: Record<string, State>) => any;
};

const initialChangeTrackerValues: ChangeTrackerValues = {
  states: {},
  setStateForMS: () => {},
  resetStates: () => {},
};

const ChangeTrackerContext = createContext<ChangeTrackerValues | null>(null);

export const useChangeTrackerContext = () => useContext(ChangeTrackerContext);

export const ChangeTrackerContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [states, setStates] = useState<Record<string, State>>(initialChangeTrackerValues.states);

  const setStateForMS = useCallback(
    (id: string, state: string) => {
      if (!id) return;

      const currentState = states[id];
      switch (state) {
        case "REMOVED":
          if (currentState === "ADDED") {
            setStates((currentStates) => {
              delete currentStates[id];
              return { ...currentStates };
            });
          } else {
            setStates((currentStates) => ({
              ...currentStates,
              [id]: "REMOVED",
            }));
          }
          break;
        case "MODIFIED":
          if (currentState && currentState !== "MODIFIED") return;
          setStates((currentStates) => ({
            ...currentStates,
            [id]: "MODIFIED",
          }));
          break;
        case "ADDED":
          setStates((currentStates) => ({ ...currentStates, [id]: "ADDED" }));
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
    <ChangeTrackerContext.Provider value={{ states, setStateForMS, resetStates }}>
      {children}
    </ChangeTrackerContext.Provider>
  );
};
