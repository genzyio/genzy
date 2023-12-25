import { forwardRef } from "react";

export function createFunctionalComponent<T>(Component: React.JSXElementConstructor<T>) {
  return forwardRef((props: T, ref: any) => (
    <div ref={ref}>
      <Component {...props}></Component>
    </div>
  ));
}
