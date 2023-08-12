import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
} from "reactflow";

import "reactflow/dist/style.css";
import ClassNode from "./class/ClassNode";
import { Class } from "./class/models";
import { Drawer } from "../../components/drawer";

const nodeTypes = {
  classNode: ClassNode,
};

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
};

export const Diagram = forwardRef<any, DiagramProps>(
  ({ nodes: initialNodes, edges: initialEdges }, _ref) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState<Class>(initialNodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<{}>(initialEdges || []);

    const onConnect = useCallback(
      (params: Connection) => setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
      [setEdges]
    );

    useImperativeHandle(
      _ref,
      () => ({
        getState: () => ({
          nodes,
          edges,
        }),
      }),
      [nodes, edges]
    );

    return (
      <>
        <div className="h-full w-full">
          {/* Future Toolbar */}
          <div className="fixed left-1/2 -translate-x-1/2 top-3 z-10 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between gap-x-3">
              <button
                className="hover:opacity-60"
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
              <button className="hover:opacity-60" onClick={() => console.log(nodes, edges)}>
                Log
              </button>
            </div>
          </div>
          <ReactFlow
            style={{}}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={() => {}}
            onNodeDoubleClick={() => {
              console.log("asd");
              setDrawerOpen(true);
            }}
            proOptions={{ account: "paid-sponsor", hideAttribution: true }}
          >
            <Controls />
            <Background size={0} />
          </ReactFlow>
        </div>

        <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} title={"GN1mbly"}>
          <div className="mx-8">Hello</div>
        </Drawer>
      </>
    );
  }
);
