import { type FC } from "react";
import FlipMove from "react-flip-move";

type FlippableProps = FlipMove.FlipMoveProps;

export const Flippable: FC<FlippableProps> = ({ children, ...props }) => {
  return <FlipMove {...props}>{children}</FlipMove>;
};

type VerticallyFlippableProps = Omit<FlippableProps, "enterAnimation" | "leaveAnimation">;

export const VerticallyFlippable: FC<VerticallyFlippableProps> = ({
  children,
  staggerDurationBy = "30",
  duration = 300,
  maintainContainerHeight = true,
  ...props
}) => {
  return (
    <FlipMove
      staggerDurationBy={staggerDurationBy}
      duration={duration}
      maintainContainerHeight={maintainContainerHeight}
      enterAnimation={"accordionVertical"}
      leaveAnimation={"accordionVertical"}
      {...props}
    >
      {children}
    </FlipMove>
  );
};
