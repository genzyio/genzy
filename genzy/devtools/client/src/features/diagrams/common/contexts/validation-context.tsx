import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

type ValidationContextValues = {
  isValid: boolean;
  getValidityFor: (id: string) => boolean;
  setValidityFor: (id: string, isValid: boolean) => any;
};

const initialValidationContextValues: ValidationContextValues = {
  isValid: true,
  getValidityFor: () => false,
  setValidityFor: () => {},
};

const ValidationContext = createContext<ValidationContextValues | null>(null);

export const useValidationContext = () => useContext(ValidationContext);

export const ValidationContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isValid, setIsValid] = useState(initialValidationContextValues.isValid);
  const [validObjects] = useState<Record<string, boolean>>({});

  const setValidityFor = useCallback(
    (id: string, newIsValid: boolean) => {
      validObjects[id] = newIsValid;
      setIsValid(
        Object.values(validObjects).reduce(
          (isValid: boolean, isCurrentValid: boolean) => isValid && isCurrentValid,
          true
        )
      );
    },
    [validObjects, setIsValid]
  );

  const getValidityFor = useCallback(
    (id: string) => {
      const isValid = validObjects[id];
      if (isValid !== undefined) {
        return isValid;
      }

      return true;
    },
    [validObjects]
  );

  return (
    <ValidationContext.Provider
      value={{
        isValid,
        getValidityFor,
        setValidityFor,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};
