import { type FC } from "react";
import { ControlButton } from "reactflow";
import { useProjectContext } from "@features/project-workspace/contexts/project.context";
import { toPng } from "html-to-image";
import { ControlsStyled } from "@core/components/diagram";

function toImage(projectName: string) {
  toPng(document.querySelector(".react-flow") as HTMLElement, {
    filter: (node) => {
      const notContainsClass = (className: string) => !node?.classList?.contains(className);
      return notContainsClass("react-flow__minimap") && notContainsClass("react-flow__controls");
    },
  })
    .then((blobUrl: string) => downloadImage(blobUrl, projectName))
    .catch((error) => console.log(error));
}

function downloadImage(blobUrl: string, imageName: string) {
  const a = document.createElement("a");
  a.setAttribute("download", `${imageName}.png`);
  a.setAttribute("href", blobUrl);
  a.click();
}

export const CustomControls: FC = () => {
  const { project } = useProjectContext();

  return (
    <ControlsStyled>
      <ControlButton>
        <div style={{ fontSize: 14 }} onClick={() => toImage(project.name)}>
          &#128247;
        </div>
      </ControlButton>
    </ControlsStyled>
  );
};
