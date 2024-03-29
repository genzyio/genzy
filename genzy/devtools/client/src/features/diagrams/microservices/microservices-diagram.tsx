import { type FC, useMemo, useState } from "react";
import {
  Connection,
  type Node,
  type Edge,
  type EdgeProps,
  type NodeProps,
  type Viewport,
} from "reactflow";
import { Communication, type Microservice } from "./models";
import { Drawer } from "@core/components/drawer";
import { MicroserviceDrawer } from "./microservice-drawer/microservice-drawer";
import { useSequenceGenerator } from "@core/hooks/useStringSequence";
import { CommunicationDrawer } from "./communication-drawer/communication-drawer";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "@features/project-workspace/contexts/project-definition.dispatcher";
import { RemovableEdge } from "../common/components/edges/removable/removable-edge";
import { RemovableNode } from "../common/components/nodes/removable-node";
import { MicroserviceNode } from "./nodes/microservice-node";
import { createPortal } from "react-dom";
import { Button } from "@core/components/button";
import { ValidationContextProvider } from "../common/contexts/validation.context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check.context";
import { Outlet } from "react-router-dom";
import nodeTypes from "../common/constants/node-types";
import edgeTypes from "../common/constants/edge-types";
import { isNodeMoved } from "../common/utils/move";
import { FloatingEdge } from "../common/components/edges/floating/floating-edge";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "@features/diagrams/common/components/diagram/diagram-styled";
import { DiagramBase } from "../common/components/diagram/diagram-base";
import { MicroserviceEvents } from "./microservices-diagram.events";
import {
  RemoveCommunicationModal,
  type RemoveCommunicationModalInstance,
} from "./remove-communication-modal";
import {
  RemoveMicroserviceModal,
  type RemoveMicroserviceModalInstance,
} from "./remove-microservice-modal";
import { useMicroservicesDiagramState } from "./microservices-diagram-state";
import { useEvent } from "@core/hooks/useEvent";
import { eventEmitter } from "@core/utils/event-emitter";

type DiagramProps = {
  nodes?: Node<Microservice>[];
  edges?: Edge<Communication>[];
  viewport: Viewport;
  onMicroserviceDeleted: (microserviceId: string) => any;
};

export const MicroservicesDiagram: FC<DiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
  onMicroserviceDeleted,
}) => {
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();

  const [{ nodes, edges, onNodesChange, onEdgesChange }, actions] = useMicroservicesDiagramState(
    initialNodes || [],
    initialEdges || []
  );
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Microservice");

  const [removeMicroserviceInstance, setRemoveMicroserviceInstance] =
    useState<RemoveMicroserviceModalInstance>(undefined);
  const [removeCommunicationInstance, setRemoveCommunicationInstance] =
    useState<RemoveCommunicationModalInstance>(undefined);

  const [selectedMicroservice, setSelectedMicroservice] = useState<Node<Microservice, string>>();
  const [selectedCommunication, setSelectedCommunication] = useState<Edge<Communication>>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const possibleServicesForCommunication = useMemo(() => {
    if (!selectedCommunication) return [];

    const destinationMicroservice = nodes.find((node) => node.id === selectedCommunication.target);

    return destinationMicroservice?.data.services ?? [];
  }, [selectedCommunication]);

  const isValidConnection = (connection: Connection) => {
    const selfConnecting = connection.source === connection.target;
    if (selfConnecting) return false;

    const connectionFromPlugin =
      nodes.find((node) => node.id === connection.source).type !== "microserviceNode";
    const connectionToPlugin =
      nodes.find((node) => node.id === connection.target).type !== "microserviceNode";
    const connectingPlugin = connectionFromPlugin || connectionToPlugin;
    if (connectingPlugin) return false;

    const alreadyConnected = edges.some(
      (edge) => edge.target === connection.target && edge.source === connection.source
    );
    if (alreadyConnected) return false;

    return true;
  };

  useEvent(
    MicroserviceEvents.ON_NODE_REMOVE,
    (node: Node) => {
      removeMicroserviceInstance.openFor(node);
    },
    [removeMicroserviceInstance]
  );

  useEvent(
    MicroserviceEvents.ON_EDGE_REMOVE,
    (edge: Edge) => {
      removeCommunicationInstance.openFor(edge);
    },
    [removeCommunicationInstance]
  );

  // Microservice Handlers
  const handleMicroserviceAdd = async () => {
    await actions.addMicroservice(nextName());
  };

  const handleMicroserviceUpdate = async (microservice: Microservice) => {
    await actions.updateMicroservice(
      selectedMicroservice.id,
      selectedMicroservice.data,
      microservice
    );

    setDrawerOpen(false);
    setSelectedMicroservice(undefined);
  };

  const handleMicroserviceDelete = async (microservice: Node<Microservice>) => {
    const microserviceId = microservice.id;

    await actions.deleteMicroservice(microserviceId);
    onMicroserviceDeleted(microserviceId);
  };

  // Communication Handlers
  const handleCommunicationAdd = actions.addCommunication;

  const handleCommunicationUpdate = async (communication: Communication) => {
    await actions.updateCommunication(
      selectedCommunication.id,
      selectedCommunication.data,
      communication
    );

    setDrawerOpen(false);
    setSelectedCommunication(undefined);
  };

  const handleCommunicationDelete = async (communication: Edge<Communication>) => {
    await actions.deleteCommunication(communication.id);
  };

  // Toolbar action
  const elem = document.getElementById("toolbar-actions");
  const portal = useMemo(() => {
    if (elem) {
      return createPortal(
        <div className="flex justify-center gap-x-3">
          <Button className="hover:opacity-60 text-xs px-1 py-1" onClick={handleMicroserviceAdd}>
            Add microservice
          </Button>
        </div>,
        elem
      );
    }
  }, [elem, handleMicroserviceAdd]);

  return (
    <ThemeProvider theme={darkTheme}>
      {portal}

      <div className="h-full w-full">
        <DiagramBase
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          isValidConnection={isValidConnection}
          onConnect={handleCommunicationAdd}
          nodeTypes={localNodeTypes}
          edgeTypes={localEdgeTypes}
          onViewportChanged={(viewport) =>
            (projectDefinition.microservices.viewport = { ...viewport })
          }
          onNodeMoved={async (beforeMoveNode, afterMoveNode) => {
            if (isNodeMoved(beforeMoveNode, afterMoveNode)) {
              await dispatcher(projectDefinitionActions.microserviceMoved, {
                microserviceId: beforeMoveNode?.id,
                type: beforeMoveNode?.type,
                position: afterMoveNode.position,
                positionAbsolute: afterMoveNode.positionAbsolute,
              });
            }
          }}
          onNodeDoubleClick={(_, node) => {
            if (node.type !== "microserviceNode") return;

            setSelectedMicroservice(node);
            setInitialState(node.data);
            setDrawerOpen(true);
          }}
          onEdgeDoubleClick={(_, edge) => {
            if (edge.type === "defaultEdge") return;

            setSelectedCommunication(edge);
            setInitialState(edge.data);
            setDrawerOpen(true);
          }}
          defaultViewport={initialViewport}
        />
      </div>

      <RemoveCommunicationModal
        onInit={setRemoveCommunicationInstance}
        handleRemove={handleCommunicationDelete}
      />

      <RemoveMicroserviceModal
        onInit={setRemoveMicroserviceInstance}
        handleRemove={handleMicroserviceDelete}
      />

      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          if (!isDirty) {
            setDrawerOpen(false);
            setSelectedMicroservice(undefined);
            setSelectedCommunication(undefined);
            return;
          }

          setDrawerOpen(false);
          promptDirtyModal(
            () => {
              setDrawerOpen(false);
              setSelectedMicroservice(undefined);
              setSelectedCommunication(undefined);
            },
            () => {
              setDrawerOpen(true);
            }
          );
        }}
        title={"Microservice"}
      >
        {selectedMicroservice && (
          <ValidationContextProvider>
            <MicroserviceDrawer
              key={selectedMicroservice.id}
              microserviceId={selectedMicroservice.id}
              microservice={selectedMicroservice.data}
              onMicroserviceUpdate={handleMicroserviceUpdate}
              nameExists={(name) =>
                nodes.some((n) => n.id !== selectedMicroservice.id && n.data.name === name)
              }
            />
          </ValidationContextProvider>
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

      <Outlet context={[actions.reinitialize]} />
    </ThemeProvider>
  );
};

// Nodes
const RemovableMicroserviceNodeWrapper: FC<NodeProps<Microservice>> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();

  const onRemove = (_, id: string) => {
    const node = projectDefinition.microservices.nodes.find((node) => node.id === id);
    eventEmitter.dispatch(MicroserviceEvents.ON_NODE_REMOVE, node);
  };

  return <RemovableNode onRemove={onRemove} element={MicroserviceNode} {...props} />;
};

const localNodeTypes = {
  ...nodeTypes,
  microserviceNode: RemovableMicroserviceNodeWrapper,
};

// Edges
const DefaultEdgeWrapper: FC<EdgeProps> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { nodes, edges } = projectDefinition.microservices;

  return <FloatingEdge nodes={nodes} edges={edges} {...props} label={undefined} />;
};

const RemovableEdgeWrapper: FC<EdgeProps> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { nodes, edges } = projectDefinition.microservices;

  const onRemove = (_, id: string) => {
    const edge = edges.find((edge) => edge.id === id);
    eventEmitter.dispatch(MicroserviceEvents.ON_EDGE_REMOVE, edge);
  };

  return <RemovableEdge nodes={nodes} edges={edges} onRemove={onRemove} {...props} />;
};

const localEdgeTypes = {
  ...edgeTypes,
  defaultEdge: DefaultEdgeWrapper,
  removableEdge: RemovableEdgeWrapper,
};
