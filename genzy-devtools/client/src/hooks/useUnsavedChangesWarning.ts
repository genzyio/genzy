import { useEffect } from "react";

export const useUnsavedChangesWarning = (condition: boolean) => {
  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      if (condition) {
        e.preventDefault();
        e.returnValue = true;
      }
    };

    window.addEventListener("beforeunload", beforeUnloadHandler);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [condition]);
};
