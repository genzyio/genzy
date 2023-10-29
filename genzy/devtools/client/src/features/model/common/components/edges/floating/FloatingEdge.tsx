import { type FC, useMemo } from "react";
import {
  type Node,
  type Edge,
  type EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
} from "reactflow";
import { getEdgeParams } from "./utils";
import { getSpecialPath } from "./special-path";

type FloatingEdgeProps = EdgeProps & {
  nodes: Node[];
  edges: Edge[];
  label?: (labelX: number, labelY: number) => JSX.Element;
};

export const FloatingEdge: FC<FloatingEdgeProps> = ({
  id,
  nodes,
  edges,
  label,
  source,
  target,
  markerEnd,
  style,
}) => {
  const findNode = (id: string) => nodes.find((node) => node.id === id);
  const sourceNode = findNode(source);
  const targetNode = findNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const isBidirectional = useMemo(() => {
    return edges.some((edge) => edge.source === target && edge.target === source);
  }, [edges, source, target]);

  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = getEdgeParams(
    sourceNode,
    targetNode
  );

  let [path, labelX, labelY] = ["", 0, 0];
  if (isBidirectional) {
    [path, labelX, labelY] = getSpecialPath(
      {
        sourceX,
        sourceY,
        targetX,
        targetY,
      },
      sourceX > targetX ? 50 : -50
    );
  } else {
    [path, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
  }

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />

      {typeof label === "function" && (
        <EdgeLabelRenderer>{label(labelX, labelY)}</EdgeLabelRenderer>
      )}
    </>
  );
};
