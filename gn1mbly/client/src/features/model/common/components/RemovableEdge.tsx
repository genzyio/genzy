import { type FC, MouseEvent } from "react";
import { type EdgeProps, BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow";

import "../styles/removable_button.css";

type RemovableEdge = EdgeProps & {
  onRemove: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => any;
};

export const RemovableEdge: FC<RemovableEdge> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  onRemove,
}: RemovableEdge) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <button className="edgebutton" onClick={(event) => onRemove(event, id)}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
