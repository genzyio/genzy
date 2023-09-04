import { type FC, MouseEvent, type ElementType } from "react";
import { type NodeProps } from "reactflow";

type RemovableNode = NodeProps<any> & {
  element: ElementType;
  onRemove: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => any;
};

export const RemovableNode: FC<RemovableNode> = ({
  onRemove,
  element: NodeElement,
  id,
  ...restOfProps
}) => {
  return (
    <>
      <div
        style={{
          fontSize: 12,
          pointerEvents: "all",
        }}
        className="nodrag nopan absolute right-[2%] top-1 z-10"
      >
        <button className="edgebutton" onClick={(event) => onRemove(event, id)}>
          x
        </button>
      </div>

      <NodeElement id={id} {...restOfProps} />
    </>
  );
};
