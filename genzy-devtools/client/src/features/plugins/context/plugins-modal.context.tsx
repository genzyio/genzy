import { type FC, type PropsWithChildren, createContext, useContext, useState } from "react";

type PluginsModalContextValues = {
  specificPlugin: string;
  setSpecificPlugin: (specificPlugin: string) => any;
  close: () => void;
};

const PluginsModalContext = createContext<PluginsModalContextValues | null>(null);

export const usePluginsModalContext = () => useContext(PluginsModalContext);

type PluginsModalContextProviderProps = PropsWithChildren & {
  close: () => void;
};

export const PluginsModalContextProvider: FC<PluginsModalContextProviderProps> = ({
  close,
  children,
}) => {
  const [specificPlugin, setSpecificPlugin] = useState("");

  return (
    <PluginsModalContext.Provider value={{ specificPlugin, setSpecificPlugin, close }}>
      {children}
    </PluginsModalContext.Provider>
  );
};
