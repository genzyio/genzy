import { type FC, MouseEvent, useCallback } from "react";
import { type Node, type Edge, type EdgeProps } from "reactflow";
import { FloatingEdge } from "../floating/FloatingEdge";
import { RemovableButton } from "./RemovableButton";

type RemovableEdge = EdgeProps & {
  nodes: Node[];
  edges: Edge[];
  onRemove: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => any;
};

export const RemovableEdge: FC<RemovableEdge> = ({
  id,
  source,
  target,
  nodes,
  edges,
  onRemove,
  ...props
}: RemovableEdge) => {
  const FloatingEdgeLabel = useCallback(
    (labelX: number, labelY: number) => (
      <RemovableButton
        onRemove={(event) => onRemove(event, id)}
        translateX={labelX}
        translateY={labelY + 2.5}
      />
    ),
    [id, onRemove]
  );

  return (
    <FloatingEdge
      {...props}
      id={id}
      source={source}
      target={target}
      nodes={nodes}
      edges={edges}
      label={FloatingEdgeLabel as any}
    />
  );
};
