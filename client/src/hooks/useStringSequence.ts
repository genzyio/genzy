import { useCallback } from "react";

export function useSequenceGenerator<T>(
  sequence: T[],
  stringAccessor: (element: T) => string,
  stringPrefix: string
) {
  return useCallback(() => {
    let i = 1;
    while (sequence.find((e) => stringAccessor(e) === `${stringPrefix}${i}`)) i++;
    return `${stringPrefix}${i}`;
  }, [sequence]);
}
