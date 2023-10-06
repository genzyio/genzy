import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";

type ImageNodeProps = NodeProps<{
  name: string;
  url: string;
  showName?: boolean;
  width?: number;
  height?: number;
}>;

export const ImageNode: FC<ImageNodeProps> = ({ id: nodeId, data: imageData }) => {
  return (
    <ConnectableNodeWrapper>
      {imageData.showName && (
        <h6 className="w-full text-center text-sm absolute -top-[30px]">{imageData.name}</h6>
      )}

      <img
        src={imageData.url}
        width={imageData.width}
        height={imageData.height}
        className="-my-2"
      />
    </ConnectableNodeWrapper>
  );
};
