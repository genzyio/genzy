import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  MarkerType,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
  type Viewport,
  ConnectionMode,
  updateEdge,
  useOnViewportChange,
} from "reactflow";
import { Communication, type Microservice } from "./models";
import { Drawer } from "../../../components/drawer";
import { MicroserviceDrawer } from "./MicroserviceDrawer";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { CommunicationDrawer } from "./CommunicationDrawer";
import { useProjectContext } from "../../projects/contexts/project.context";
import nodeTypes from "../common/nodeTypes";

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
  viewport: any;
};

let updateValidation = false;

export const MicroservicesDiagram: FC<DiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
}) => {
  const { projectDefinition, addMicroservice } = useProjectContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Microservice>(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Communication>(initialEdges || []);
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Microservice");

  const [selectedMicroservice, setSelectedMicroservice] = useState<Node<Microservice, string>>();
  const [selectedCommunication, setSelectedCommunication] = useState<Edge<Communication>>();

  const possibleServicesForCommunication = useMemo(() => {
    if (!selectedCommunication) return [];

    const destinationMicroservice = nodes.find((node) => node.id === selectedCommunication.target);

    return destinationMicroservice?.data.services ?? [];
  }, [selectedCommunication]);

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    projectDefinition.microservices = {
      ...projectDefinition.microservices,
      nodes,
      edges,
    };
  }, [nodes, edges]);

  useOnViewportChange({
    onEnd: useCallback((viewport: Viewport) => {
      projectDefinition.microservices.viewport = { ...viewport };
    }, []),
  });

  const isValidConnection = (connection: Connection) => {
    const selfConnecting = connection.source === connection.target;
    if (selfConnecting) return false;

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
            data: {
              services: [],
            },
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

  const handleMicroserviceAdd = () => {
    const microserviceId = `${+new Date()}`;
    setNodes((nodes) => [
      ...nodes,
      {
        id: microserviceId,
        position: { x: 0, y: 0 },
        data: {
          name: nextName(),
          services: [],
        },
        type: "microserviceNode",
      },
    ]);
    addMicroservice(microserviceId);
  };

  const handleMicroserviceUpdate = (microservice: Microservice) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedMicroservice.id) {
          return { ...node, data: microservice };
        }
        return node;
      })
    );
  };

  const handleCommunicationUpdate = (communication: Communication) => {
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === selectedCommunication.id) {
          return { ...edge, data: communication };
        }
        return edge;
      })
    );
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="relative left-1/2 -translate-x-1/2 top-3 z-10 p-3 rounded-lg border border-gray-200 w-[20%]">
          <div className="flex justify-between gap-x-3">
            <button className="hover:opacity-60" onClick={handleMicroserviceAdd}>
              Add microservice
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
          onNodeDoubleClick={(_, node) => {
            setSelectedMicroservice(node);
            setDrawerOpen(true);
          }}
          onEdgeDoubleClick={(_, edge) => {
            setSelectedCommunication(edge);
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

      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedMicroservice(undefined);
          setSelectedCommunication(undefined);
        }}
        title={"GN1mbly"}
      >
        {selectedMicroservice && (
          <MicroserviceDrawer
            key={selectedMicroservice.id}
            microservice={selectedMicroservice.data}
            onMicroserviceUpdate={handleMicroserviceUpdate}
            nameExists={(name) =>
              nodes.some((n) => n.id !== selectedMicroservice.id && n.data.name === name)
            }
          />
        )}

        {selectedCommunication && (
          <CommunicationDrawer
            key={selectedCommunication.id}
            communication={selectedCommunication.data}
            onCommunicationUpdate={handleCommunicationUpdate}
            possibleServices={possibleServicesForCommunication}
          />
        )}
      </Drawer>
    </>
  );
};
