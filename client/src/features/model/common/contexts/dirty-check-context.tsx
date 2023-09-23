import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ConfirmationModal } from "../../../../components/confirmation-modal";
import { useUnsavedChangesWarning } from "../../../../hooks/useUnsavedChangesWarning";

type DirtyCheckContextValues = {
  isDirty: boolean;
  setInitialState: (state: any) => void;
  setCurrentState: (state: any) => void;
  promptDirtyModal: (onYes: () => void, onClose: () => void) => void;
};

const DirtyCheckContext = createContext<DirtyCheckContextValues | null>(null);

export const useDirtyCheckContext = () => useContext(DirtyCheckContext);

export const DirtyCheckContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = useCallback(() => setModalOpen((open) => !open), [setModalOpen]);

  const [initialState, setInitialState] = useState(null);
  const [currentState, setCurrentState] = useState(null);

  const [onDirtyCheckModalYes, setOnDirtyCheckModalYes] = useState<any>(() => () => {});
  const [onDirtyCheckModalClose, setOnDirtyCheckModalClose] = useState<any>(() => () => {});

  const isDirty = useMemo(
    () => JSON.stringify(initialState) !== JSON.stringify(currentState),
    [initialState, currentState]
  );

  const promptDirtyModal = (onYes: () => void, onClose: () => void) => {
    setOnDirtyCheckModalYes(() => onYes);
    setOnDirtyCheckModalClose(() => onClose);

    if (isDirty) toggleModal();
  };

  const setAndResetInitialState = (state: any) => {
    setInitialState(state);
    setCurrentState(state);

    setOnDirtyCheckModalClose(() => () => {});
    onDirtyCheckModalClose(() => () => {});
  };

  useUnsavedChangesWarning(isDirty);

  return (
    <>
      <ConfirmationModal
        title="Unsaved changes"
        isOpen={isModalOpen}
        onYes={() => {
          onDirtyCheckModalYes();
          toggleModal();
        }}
        onClose={() => {
          onDirtyCheckModalClose();
          toggleModal();
        }}
      >
        You have some unsaved changes. Are you sure that you want to discard them?
      </ConfirmationModal>

      <DirtyCheckContext.Provider
        value={{
          isDirty,
          setInitialState: setAndResetInitialState,
          setCurrentState,
          promptDirtyModal,
        }}
      >
        {children}
      </DirtyCheckContext.Provider>
    </>
  );
};
