import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { ConnectableNodeWrapper } from "../../common/components/nodes/ConnectableNodeWrapper";
import { getImageProxyUrl } from "@core/utils/proxy-image";

type ImageNodeProps = NodeProps<{
  name: string;
  url: string;
  showName?: boolean;
  width?: number;
  height?: number;
}>;

export const ImageNode: FC<ImageNodeProps> = ({ data: imageData }) => {
  return (
    <div className="image-node">
      <ConnectableNodeWrapper>
        {imageData.showName && (
          <h6 className="w-full text-center text-sm absolute -top-[30px]">{imageData.name}</h6>
        )}

        <img
          src={getImageProxyUrl(imageData.url)}
          width={imageData.width}
          height={imageData.height}
        />
      </ConnectableNodeWrapper>
    </div>
  );
};
