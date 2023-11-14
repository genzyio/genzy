import { type FC, MouseEvent, type ElementType } from "react";
import { type NodeProps } from "reactflow";
import { useWatchModeContext } from "../../../../project-workspace/contexts/watch-mode.context";
import { RemovableButton } from "../edges/removable/RemovableButton";

type RemovableNode = NodeProps<any> & {
  element: ElementType;
  onRemove: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => any;
};

export const RemovableNode: FC<RemovableNode> = ({
  onRemove,
  element: NodeElement,
  id,
  type,
  ...restOfProps
}) => {
  // TODO: Da li je moguce da se da neki disabled property umesto ovoga?
  const { isMicroserviceActive } = useWatchModeContext();
  const microserviceActive = type === "microserviceNode" && isMicroserviceActive(id);

  return (
    <>
      <div
        style={{
          fontSize: 12,
          pointerEvents: "all",
        }}
        className="nodrag nopan absolute right-[2%] top-1 z-10"
        hidden={microserviceActive}
      >
        <RemovableButton
          onRemove={(event) => onRemove(event, id)}
          translateX={-12.5}
          translateY={15}
        />
      </div>

      <NodeElement id={id} type={type} {...restOfProps} />
    </>
  );
};
