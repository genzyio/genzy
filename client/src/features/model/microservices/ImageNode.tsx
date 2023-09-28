import { type FC } from "react";
import { type NodeProps } from "reactflow";
import { ConnectableNodeWrapper } from "../common/components/ConnectableNodeWrapper";

type ImageNodeProps = NodeProps<{
  name: string;
  url: string;
  width?: number;
  height?: number;
}>;

export const ImageNode: FC<ImageNodeProps> = ({ id: nodeId, data: imageData }) => {
  return (
    <div className={`p-4 rounded-lg border-2 bg-white border-gray-600 flex flex-col gap-y-2`}>
      <ConnectableNodeWrapper>
        <img src={imageData.url} width={imageData.width} height={imageData.height} />
        <div>
          {/* <h6 className="w-full text-center text-sm text-gray-700">{microservice.basePath}</h6>
          <h2 className="w-full text-center text-xl mb-2">{microservice.name}</h2> */}
        </div>
      </ConnectableNodeWrapper>
    </div>
  );
};
