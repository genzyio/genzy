import { Handle, Position } from "reactflow";
import { type FC, type PropsWithChildren } from "react";

type ConnectableNodeWrapperProps = PropsWithChildren & {
  isConnectable?: boolean;
};

export const ConnectableNodeWrapper: FC<ConnectableNodeWrapperProps> = ({
  isConnectable = true,
  children,
}) => {
  return (
    <>
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        style={{
          background: "#04F7B5", // brand-primary
          width: "1rem",
          height: "1rem",
          top: -10,
        }}
        isConnectable={isConnectable}
      />
      {children}
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        style={{
          background: "#04F7B5", // brand-primary
          width: "1rem",
          height: "1rem",
          bottom: -10,
        }}
        isConnectable={isConnectable}
      />
    </>
  );
};
