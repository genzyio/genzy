import { type FC } from "react";
import { getSmoothStepPath, type ConnectionLineComponentProps, BaseEdge } from "reactflow";

export const SmoothStepConnectionLine: FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return <BaseEdge path={edgePath} />;
};
