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
import { useProjectContext } from "../../projects/contexts/project.context";
import nodeTypes from "../common/nodeTypes";

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

  const isValidConnection = (connection: Connection) => {
    const selfConnecting = connection.source === connection.target;
    if (selfConnecting) return false;

    const connectingFromRemoteProxy =
      nodes.find((node) => node.id === connection.source).data.type === "REMOTE_PROXY";
    if (connectingFromRemoteProxy) return;

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
            if (node.data.type === "REMOTE_PROXY") return;
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
