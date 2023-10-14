import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";

type MicroserviceContextValues = {
  microserviceId: string;
  setMicroserviceId: (microserviceId: string) => any;
};

const MicroserviceContext = createContext<MicroserviceContextValues | null>(null);

export const useMicroserviceContext = () => useContext(MicroserviceContext);

export const MicroserviceContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [microserviceId, setMicroserviceId] = useState("");

  return (
    <MicroserviceContext.Provider value={{ microserviceId, setMicroserviceId }}>
      {children}
    </MicroserviceContext.Provider>
  );
};
