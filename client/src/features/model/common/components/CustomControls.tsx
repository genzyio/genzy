import { type FC } from "react";
import { ControlButton, Controls } from "reactflow";
import { toPng } from "html-to-image";

function toImage() {
  toPng(document.querySelector(".react-flow") as HTMLElement, {
    filter: (node) => {
      if (
        node?.classList?.contains("react-flow__minimap") ||
        node?.classList?.contains("react-flow__controls")
      ) {
        return false;
      }

      return true;
    },
  }).then((blobUrl: string) => {
    const a = document.createElement("a");
    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", blobUrl);
    a.click();
  });
}

export const CustomControls: FC = () => {
  return (
    <Controls>
      <ControlButton>
        <div style={{ fontSize: 14 }} onClick={toImage}>
          &#128247;
        </div>
      </ControlButton>
    </Controls>
  );
};
