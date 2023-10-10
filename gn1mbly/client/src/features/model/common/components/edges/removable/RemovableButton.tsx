import { type FC, MouseEvent } from "react";

import "./removable_button.css";

type RemovableButtonProps = {
  onRemove: (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => any;
  translateX: number;
  translateY: number;
};

export const RemovableButton: FC<RemovableButtonProps> = ({ onRemove, translateX, translateY }) => {
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${translateX}px,${translateY}px)`,
        fontSize: 12,
        pointerEvents: "all",
      }}
      className="nodrag nopan"
    >
      <button className="edgebutton" onClick={(event) => onRemove(event)}>
        ×
      </button>
    </div>
  );
};
