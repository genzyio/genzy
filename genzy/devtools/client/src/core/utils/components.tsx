import { forwardRef } from "react";

export function createFunctionalComponent<T>(
  Component: React.JSXElementConstructor<T>,
  displayName: string
) {
  const FunctionalCompoenent = forwardRef((props: T, ref: any) => (
    <div ref={ref}>
      <Component {...props}></Component>
    </div>
  ));
  FunctionalCompoenent.displayName = displayName;

  return FunctionalCompoenent;
}
