import { Handle, Position } from "reactflow";
import { type FC, type PropsWithChildren } from "react";

export const ConnectableNodeWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        style={{
          background: "#555",
          width: "1rem",
          height: "1rem",
          top: -10,
        }}
        isConnectable={true}
      />
      {children}
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        style={{
          background: "#555",
          width: "1rem",
          height: "1rem",
          bottom: -10,
        }}
        isConnectable={true}
      />
    </>
  );
};
