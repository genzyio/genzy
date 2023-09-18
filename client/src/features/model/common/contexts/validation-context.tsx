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
  setValidityFor: (id: string, isValid: boolean) => any;
};

const initialValidationContextValues: ValidationContextValues = {
  isValid: true,
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

  return (
    <ValidationContext.Provider
      value={{
        isValid,
        setValidityFor,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};
