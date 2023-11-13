import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";

type MicroserviceContextValues = {
  microserviceId: string;
};

const MicroserviceContext = createContext<MicroserviceContextValues | null>(null);

export const useMicroserviceContext = () => useContext(MicroserviceContext);

type MicroserviceContextProviderProps = PropsWithChildren & {
  microserviceId: string;
};

export const MicroserviceContextProvider: FC<MicroserviceContextProviderProps> = ({
  microserviceId: initialMicroserviceId,
  children,
}) => {
  const [microserviceId] = useState(initialMicroserviceId);

  return (
    <MicroserviceContext.Provider value={{ microserviceId }}>
      {children}
    </MicroserviceContext.Provider>
  );
};
