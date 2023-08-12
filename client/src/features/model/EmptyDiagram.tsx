import { type FC } from "react";
import ReactFlow, { Background } from "reactflow";

import "reactflow/dist/style.css";

export const EmptyDiagram: FC = () => {
  return (
    <>
      <div className="h-full w-full">
        <ReactFlow style={{}} proOptions={{ account: "paid-sponsor", hideAttribution: true }}>
          <Background size={0} />
        </ReactFlow>
      </div>
    </>
  );
};
