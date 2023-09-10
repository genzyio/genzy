import { useState } from "react";

export const useRefresh = (key: string) => {
  const [counter, setCounter] = useState<number>(0);

  return {
    key: `${key}_${counter}`,
    refresh: () => setCounter((counter) => ++counter),
  };
};
