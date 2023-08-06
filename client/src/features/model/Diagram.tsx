import { useCallback } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge, Connection } from "reactflow";

import "reactflow/dist/style.css";
import ClassNode from "./class/ClassNode";
import { Class } from "./class/models";

const nodeTypes = {
  classNode: ClassNode,
};

export default function Diagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Class>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{}>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button
        onClick={() =>
          setNodes((ns) => [
            ...ns,
            {
              id: `${+new Date()}`,
              position: { x: 0, y: 0 },
              data: { name: "Class", attributes: [] },
              type: "classNode",
            },
          ])
        }
      >
        Add node
      </button>
      <button onClick={() => console.log(nodes, edges)}>Log</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}
