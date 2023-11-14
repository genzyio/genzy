import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Connection,
  addEdge,
  useEdgesState,
  useNodesState,
  type Node,
  type Edge,
  type Viewport,
  ConnectionMode,
  useOnViewportChange,
  type EdgeProps,
  type NodeProps,
} from "reactflow";
import { Communication, type Microservice } from "./models";
import { Drawer } from "../../../core/components/drawer";
import { MicroserviceDrawer } from "./microservice-drawer/MicroserviceDrawer";
import { useSequenceGenerator } from "../../../core/hooks/useStringSequence";
import { CommunicationDrawer } from "./communication-drawer/CommunicationDrawer";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";
import { findArrayDiff } from "../../../core/utils/diff";
import { ConfirmationModal } from "../../../core/components/confirmation-modal";
import { RemovableEdge } from "../common/components/edges/removable/RemovableEdge";
import { RemovableNode } from "../common/components/nodes/RemovableNode";
import { MicroserviceNode } from "./nodes/MicroserviceNode";
import { createPortal } from "react-dom";
import { Button } from "../../../core/components/button";
import { ValidationContextProvider } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import { Outlet } from "react-router-dom";
import { useProjectContext } from "../../project-workspace/contexts/project.context";
import nodeTypes from "../common/constants/nodeTypes";
import edgeTypes from "../common/constants/edgeTypes";
import { isNodeMoved } from "../common/utils/move.utils";
import { SmoothStepConnectionLine } from "../common/components/edges/smooth-step/SmoothStepConnectionLine";
import { FloatingEdge } from "../common/components/edges/floating/FloatingEdge";
import { ThemeProvider } from "styled-components";
import { MiniMapStyled, ReactFlowStyled, darkTheme } from "../../../core/components/diagram";
import { CustomControls } from "../common/components/CustomControls";

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
  viewport: any;
  onMicroserviceDeleted: (microserviceId: string) => any;
};

export const MicroservicesDiagram: FC<DiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
  onMicroserviceDeleted,
}) => {
  const { project } = useProjectContext();
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Microservice>([...initialNodes] || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Communication>([...initialEdges] || []);
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Microservice");

  const [selectedMicroservice, setSelectedMicroservice] = useState<Node<Microservice, string>>();
  const [selectedCommunication, setSelectedCommunication] = useState<Edge<Communication>>();
  const targetedMicroservice = nodes.find((node) => node.id === selectedCommunication?.target)?.data
    ?.name;

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDeleteCommunicationModalOpen, setIsDeleteCommunicationModalOpen] = useState(false);
  const [isDeleteMicroserviceModalOpen, setIsDeleteMicroserviceModalOpen] = useState(false);

  const possibleServicesForCommunication = useMemo(() => {
    if (!selectedCommunication) return [];

    const destinationMicroservice = nodes.find((node) => node.id === selectedCommunication.target);

    return destinationMicroservice?.data.services ?? [];
  }, [selectedCommunication]);

  useEffect(() => {
    projectDefinition.microservices = {
      ...projectDefinition.microservices,
      nodes: [...nodes],
      edges: [...edges],
    };
  }, [nodes, edges]);

  useEffect(() => {
    setExecuteOnUndoRedo(() => () => {
      const { nodes, edges } = projectDefinition.microservices;
      setNodes([...nodes]);
      setEdges([...edges]);
    });

    return () => setExecuteOnUndoRedo(() => () => {});
  }, [setNodes, setEdges]);

  useOnViewportChange({
    onEnd: useCallback((viewport: Viewport) => {
      projectDefinition.microservices.viewport = { ...viewport };
    }, []),
  });

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

  const onConnect = useCallback(
    async (params: Connection) => {
      const newEdge = await dispatcher(projectDefinitionActions.addCommunication, { params });

      setEdges((edges) => addEdge(newEdge, edges));
    },
    [dispatcher, setEdges]
  );

  // Handle Microservice Add
  const handleMicroserviceAdd = async () => {
    const microserviceNode = await dispatcher(projectDefinitionActions.addMicroservice, {
      name: nextName(),
    });

    setNodes((nodes) => [...nodes, microserviceNode]);
  };

  // Handle Microservice Update
  const handleMicroserviceUpdate = async (microservice: Microservice) => {
    const {
      new: newServices,
      existing: existingServices,
      removed: removedServices,
    } = findArrayDiff(selectedMicroservice.data.services, microservice.services, (s) => s.id);

    await dispatcher(projectDefinitionActions.updateMicroservice, {
      microserviceId: selectedMicroservice.id,
      microservice,
      newServices,
      existingServices,
      removedServices,
    });

    // Update nodes on current diagram
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedMicroservice.id) {
          return { ...node, data: microservice };
        }
        return node;
      })
    );

    setDrawerOpen(false);
    setSelectedMicroservice(undefined);
  };

  // Handle Microservice Delete
  const handleMicroserviceDelete = async () => {
    const removedMicroserviceId = selectedMicroservice.id;

    await dispatcher(projectDefinitionActions.deleteMicroservice, {
      microserviceId: removedMicroserviceId,
    });

    const { nodes, edges } = projectDefinition.microservices;
    setNodes([...nodes]);
    setEdges([...edges]);

    onMicroserviceDeleted(selectedMicroservice.id);

    setIsDeleteMicroserviceModalOpen(false);
    setSelectedMicroservice(undefined);
  };

  const onCancelMicroserviceDelete = () => {
    setIsDeleteMicroserviceModalOpen(false);
    setSelectedMicroservice(undefined);
  };

  const RemovableMicroserviceNodeWrapper = useCallback(
    (props: NodeProps<Microservice>) => {
      const onRemove = (_, id: string) => {
        const node = projectDefinition.microservices.nodes.find((node) => node.id === id);
        setSelectedMicroservice(node);
        setIsDeleteMicroserviceModalOpen(true);
      };

      return <RemovableNode onRemove={onRemove} element={MicroserviceNode} {...props} />;
    },
    [setSelectedMicroservice, setIsDeleteMicroserviceModalOpen]
  );

  const localNodeTypes = useMemo(
    () => ({
      ...nodeTypes,
      microserviceNode: RemovableMicroserviceNodeWrapper,
    }),
    [RemovableMicroserviceNodeWrapper]
  );

  // Handle Communication Update
  const handleCommunicationUpdate = async (communication: Communication) => {
    const { new: newServiceIds, removed: removedServiceIds } = findArrayDiff(
      selectedCommunication.data.services,
      communication.services
    );

    await dispatcher(projectDefinitionActions.updateCommunication, {
      communicationId: selectedCommunication.id,
      communication,
      newServiceIds,
      removedServiceIds,
    });

    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === selectedCommunication.id) {
          return { ...edge, data: communication };
        }
        return edge;
      })
    );

    setDrawerOpen(false);
    setSelectedCommunication(undefined);
  };

  // Handle Communication Delete
  const handleCommunicationDelete = async () => {
    await dispatcher(projectDefinitionActions.removeCommunication, {
      communicationId: selectedCommunication.id,
    });

    setEdges((edges) => edges.filter((edge) => edge.id !== selectedCommunication.id));

    setIsDeleteCommunicationModalOpen(false);
    setSelectedCommunication(undefined);
  };

  const onCancelCommunicationDelete = () => {
    setIsDeleteCommunicationModalOpen(false);
    setSelectedCommunication(undefined);
  };

  const DefaultEdgeWrapper = useCallback((props: EdgeProps) => {
    const { nodes, edges } = projectDefinition.microservices;
    return <FloatingEdge nodes={nodes} edges={edges} {...props} label={undefined} />;
  }, []);

  const RemovableEdgeWrapper = useCallback(
    (props: EdgeProps) => {
      const { nodes, edges } = projectDefinition.microservices;
      const onRemove = (_, id: string) => {
        const edge = edges.find((edge) => edge.id === id);
        setSelectedCommunication(edge);
        setIsDeleteCommunicationModalOpen(true);
      };

      return <RemovableEdge nodes={nodes} edges={edges} onRemove={onRemove} {...props} />;
    },
    [setSelectedCommunication, setIsDeleteCommunicationModalOpen]
  );

  const localEdgeTypes = useMemo(
    () => ({
      ...edgeTypes,
      defaultEdge: DefaultEdgeWrapper,
      removableEdge: RemovableEdgeWrapper,
    }),
    [DefaultEdgeWrapper, RemovableEdgeWrapper]
  );

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
        <ReactFlowStyled
          className="validationflow"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          isValidConnection={isValidConnection}
          onConnect={onConnect}
          nodeTypes={localNodeTypes}
          edgeTypes={localEdgeTypes}
          onNodeDragStart={(_, node) => setSelectedMicroservice(node)}
          onNodeDragStop={async (_, node) => {
            if (isNodeMoved(selectedMicroservice, node)) {
              await dispatcher(projectDefinitionActions.microserviceMoved, {
                microserviceId: selectedMicroservice?.id,
                type: selectedMicroservice?.type,
                position: node.position,
                positionAbsolute: node.positionAbsolute,
              });
            }
            setSelectedMicroservice(undefined);
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
          connectionMode={ConnectionMode.Loose}
          defaultViewport={initialViewport}
          deleteKeyCode={""}
          proOptions={{ account: "paid-sponsor", hideAttribution: true }}
          connectionLineComponent={SmoothStepConnectionLine}
        >
          <MiniMapStyled zoomable pannable />
          <CustomControls />
          <Background size={0} />
        </ReactFlowStyled>
      </div>

      <ConfirmationModal
        title={`Stop communication with ${targetedMicroservice}`}
        isOpen={isDeleteCommunicationModalOpen}
        onYes={handleCommunicationDelete}
        onClose={onCancelCommunicationDelete}
      >
        <span>
          Are you sure that you want to stop communication with {targetedMicroservice}. By stopping
          communication, all remote proxies to this microservice will be removed.
        </span>
      </ConfirmationModal>

      <ConfirmationModal
        title={`Delete ${selectedMicroservice?.data?.name}`}
        isOpen={isDeleteMicroserviceModalOpen}
        onYes={handleMicroserviceDelete}
        onClose={onCancelMicroserviceDelete}
      >
        <span>
          Are you sure that you want to delete {selectedMicroservice?.data?.name}. By deleting{" "}
          {selectedMicroservice?.data?.name}, all communication will be removed.
        </span>
      </ConfirmationModal>

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

      <Outlet
        context={[
          () => {
            setNodes([...projectDefinition.microservices.nodes]);
            setEdges([...projectDefinition.microservices.edges]);
          },
        ]}
      />
    </ThemeProvider>
  );
};
