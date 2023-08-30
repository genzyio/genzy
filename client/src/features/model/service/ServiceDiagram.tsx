import { type FC, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
  MiniMap,
  type Node,
  type Edge,
  type Viewport,
  MarkerType,
  useOnViewportChange,
  ConnectionMode,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { type Service } from "./models";
import { Drawer } from "../../../components/drawer";
import { ServiceDrawer } from "./ServiceDrawer";
import { ServiceNode } from "./ServiceNode";
import { useProjectContext } from "../../projects/contexts/project.context";
import { useMicroserviceContext } from "../microservices/MicroserviceContext";
import { useTypesContext } from "../class/TypesContext";

const nodeTypes = { serviceNode: ServiceNode };

type DiagramProps = {
  microserviceId: string;
  nodes?: any[];
  edges?: any[];
  viewport: any;
};

let updateValidation = false;

export const ServiceDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
}) => {
  const { projectDefinition } = useProjectContext();
  const { setMicroserviceId } = useMicroserviceContext();
  const { types, updateTypes } = useTypesContext(microserviceId);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState<Service>(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{}>(initialEdges || []);

  const [selected, setSelected] = useState<Node<Service, string>>();

  useEffect(() => {
    projectDefinition.services[microserviceId] = {
      ...projectDefinition.services[microserviceId],
      nodes,
      edges,
    };
  }, [nodes, edges]);

  useOnViewportChange({
    onEnd: useCallback((viewport: Viewport) => {
      projectDefinition.services[microserviceId].viewport = { ...viewport };
    }, []),
  });

  useEffect(() => {
    if (types.length) return;
    updateTypes(projectDefinition.classes[microserviceId]?.nodes ?? []);
  }, []);

  useEffect(() => {
    setMicroserviceId(microserviceId);

    return () => setMicroserviceId("");
  }, []);

  const isValidConnection = (connection: Connection) => {
    const selfConnecting = connection.source === connection.target;
    if (selfConnecting) return false;

    // TODO: check circular dependencies
    const alreadyConnected = edges.some(
      (edge) => edge.target === connection.target && edge.source === connection.source
    );
    if (alreadyConnected && !updateValidation) return false;

    return true;
  };

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

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    const changingSource = oldEdge.source !== newConnection.source;
    const changingTarget = oldEdge.target !== newConnection.target;
    if (changingSource || changingTarget) return;

    setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
  }, []);

  const nextName = () => {
    let i = 1;
    while (nodes.find((n) => n.data.name === `Service${i}`)) i++;
    return `Service${i}`;
  };

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
      <div className="h-full w-full">
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
                      microserviceId,
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
          className="validationflow"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          isValidConnection={isValidConnection}
          onConnect={onConnect}
          onEdgeUpdateStart={() => (updateValidation = true)}
          onEdgeUpdateEnd={() => (updateValidation = false)}
          onEdgeUpdate={onEdgeUpdate}
          nodeTypes={nodeTypes}
          onNodeClick={() => {}}
          onNodeDoubleClick={(_e, node) => {
            setSelected(node);
            setDrawerOpen(true);
          }}
          connectionMode={ConnectionMode.Loose}
          defaultViewport={initialViewport}
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
};
