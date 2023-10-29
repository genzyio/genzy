import { useCallback, useEffect, useRef } from "react";

// debounce hook with an option to execute the function immediately and returns a callable debounced function
export function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(func);

  useEffect(() => {
    callback.current = func;
  }, [func]);

  return useCallback(
    (...args: any[]) => {
      const later = () => {
        timeout.current = undefined;
        if (!immediate) {
          callback.current(...args);
        }
      };

      const callNow = immediate && timeout.current === undefined;

      if (timeout.current !== undefined) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(later, wait);

      if (callNow) {
        callback.current(...args);
      }
    },
    [wait, immediate]
  ) as T;
}
