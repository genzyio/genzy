import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type State = "ADDED" | "MODIFIED" | "REMOVED";

type ChangeTrackerValues = {
  states: Record<string, State>;
  setStateForMS: (id: string, state: State) => any;
  resetStates: () => any;
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
            delete states[id];
            setStates({ ...states });
          } else {
            setStates({
              ...states,
              [id]: "REMOVED",
            });
          }
          break;
        case "MODIFIED":
          if (currentState && currentState !== "MODIFIED") return;
          setStates({
            ...states,
            [id]: "MODIFIED",
          });
          break;
        case "ADDED":
          setStates({ ...states, [id]: "ADDED" });
      }
    },
    [states, setStates]
  );

  const resetStates = useCallback(() => {
    setStates({});
  }, [setStates]);

  return (
    <ChangeTrackerContext.Provider value={{ states, setStateForMS, resetStates }}>
      {children}
    </ChangeTrackerContext.Provider>
  );
};
