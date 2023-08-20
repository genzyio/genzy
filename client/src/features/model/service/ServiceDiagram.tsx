import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
  MiniMap,
  type Node,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { type Service } from "./models";
import { Drawer } from "../../../components/drawer";
import { ServiceDrawer } from "./ServiceDrawer";
import { ServiceNode } from "./ServiceNode";

const nodeTypes = { serviceNode: ServiceNode };

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
};

export const ServiceDiagram = forwardRef<any, DiagramProps>(
  ({ nodes: initialNodes, edges: initialEdges }, _ref) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState<Service>(initialNodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState<{}>(initialEdges || []);

    const [selected, setSelected] = useState<Node<Service, string>>();

    // TODO: check circular dependencies
    const onConnect = useCallback(
      (params: Connection) =>
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              type: "smoothstep",
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 30,
                height: 30,
              },
            },
            eds
          )
        ),
      [setEdges]
    );

    const nextName = () => {
      let i = 1;
      while (nodes.find((n) => n.data.name === `Service${i}`)) i++;
      return `Service${i}`;
    };

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

    const handleUpdate = (service: Service) => {
      setNodes((ns) =>
        ns.map((n) => {
          if (n.id === selected.id) n.data = service;
          return n;
        })
      );
    };

    return (
      <>
        <div className="h-[50%] w-full">
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
                      data: {
                        name: nextName(),
                        functions: [],
                        type: "CONTROLLER",
                      },
                      type: "serviceNode",
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
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={() => {}}
            onNodeDoubleClick={(_e, node) => {
              setSelected(node);
              setDrawerOpen(true);
            }}
            proOptions={{ account: "paid-sponsor", hideAttribution: true }}
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background size={0} />
          </ReactFlow>
        </div>

        <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} title={"GN1mbly"}>
          {selected && (
            <ServiceDrawer
              service={selected.data}
              updateService={handleUpdate}
              nameExists={(name) => nodes.some((n) => n.id !== selected.id && n.data.name === name)}
            />
          )}
        </Drawer>
      </>
    );
  }
);
