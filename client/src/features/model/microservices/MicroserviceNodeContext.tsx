import { type FC, type PropsWithChildren, createContext, useContext } from "react";

type MicroserviceNodeContextValues = {
  onServicesClick: (microservice: string) => any;
  onModelsClick: (microservice: string) => any;
};

const MicroserviceNodeContext = createContext<MicroserviceNodeContextValues | null>(null);

export const useMicroserviceNodeContext = () => useContext(MicroserviceNodeContext);

export const MicroserviceNodeContextProvider: FC<
  PropsWithChildren & MicroserviceNodeContextValues
> = ({ children, onServicesClick, onModelsClick }) => {
  return (
    <MicroserviceNodeContext.Provider value={{ onServicesClick, onModelsClick }}>
      {children}
    </MicroserviceNodeContext.Provider>
  );
};
