import { type FC, MouseEvent, type ElementType } from "react";
import { type NodeProps } from "reactflow";
import { useWatchModeContext } from "../../../projects/contexts/watch-mode.context";

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
        <button className="edgebutton" onClick={(event) => onRemove(event, id)}>
          x
        </button>
      </div>

      <NodeElement id={id} type={type} {...restOfProps} />
    </>
  );
};
