import { type FC, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  ConnectionMode,
  useOnViewportChange,
  type Node,
  type Viewport,
} from "reactflow";
import { MiniMapStyled, ReactFlowStyled } from "@core/components/diagram";
import { CustomControls } from "./CustomControls";
import { SmoothStepConnectionLine } from "../edges/smooth-step/SmoothStepConnectionLine";
import { classNames } from "@core/utils/classNames";

type ReactFlowProps = (typeof ReactFlow)["defaultProps"];

type DiagramBaseProps = Omit<
  ReactFlowProps,
  | "onNodeDragStart"
  | "onNodeDrag"
  | "onNodeDragStop"
  | "connectionMode"
  | "deleteKeyCode"
  | "proOptions"
  | "connectionLineComponent"
> & {
  onViewportChanged: (viewport: Viewport) => void;
  onNodeMoved: (beforMoveNode: Node, afterMoveNode: Node) => void;
  supportsConnection?: boolean;
  showMinimap?: boolean;
  showControls?: boolean;
};

export const DiagramBase: FC<DiagramBaseProps> = ({
  className = "",
  onViewportChanged,
  onNodeMoved,
  supportsConnection = true,
  showMinimap = true,
  showControls = true,
  ...props
}) => {
  const [draggedNode, setDraggedNode] = useState<Node | undefined>(undefined);

  useOnViewportChange({
    onEnd: useCallback(onViewportChanged, []),
  });

  return (
    <ReactFlowStyled
      className={classNames("validationflow", className)}
      onNodeDragStart={(_, node) => setDraggedNode(node)}
      onNodeDragStop={(_, node) => {
        onNodeMoved(draggedNode, node);
        setDraggedNode(undefined);
      }}
      deleteKeyCode={""}
      proOptions={{ account: "paid-sponsor", hideAttribution: true }}
      {...(supportsConnection
        ? {
            connectionMode: ConnectionMode.Loose,
            connectionLineComponent: SmoothStepConnectionLine,
          }
        : {})}
      {...props}
    >
      {showMinimap && <MiniMapStyled zoomable pannable />}
      {showControls && <CustomControls />}
      <Background size={0} />
    </ReactFlowStyled>
  );
};
