import { useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [on, setOn] = useState(initialValue);
  return [on, () => setOn((on) => !on)] as const;
};
