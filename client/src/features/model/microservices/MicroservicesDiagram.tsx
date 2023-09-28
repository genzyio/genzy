import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
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
  type EdgeProps,
  type NodeProps,
} from "reactflow";
import { Communication, type Microservice } from "./models";
import { Drawer } from "../../../components/drawer";
import { MicroserviceDrawer } from "./MicroserviceDrawer";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { CommunicationDrawer } from "./CommunicationDrawer";
import { useProjectDefinitionContext } from "../../projects/contexts/project-definition.context";
import { projectDefinitionActions } from "../../projects/contexts/project-definition.dispatcher";
import nodeTypes from "../common/constants/nodeTypes";
import { findArrayDiff } from "../../../utils/diff";
import { ConfirmationModal } from "../../../components/confirmation-modal";
import { RemovableEdge } from "../common/components/RemovableEdge";
import { RemovableNode } from "../common/components/RemovableNode";
import { MicroserviceNode } from "./MicroserviceNode";
import { createPortal } from "react-dom";
import { Button } from "../../../components/button";
import { ValidationContextProvider } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import { PluginModal } from "../../plugins/components/plugins-modal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProjectContext } from "../../projects/contexts/project.context";
import { MicroserviceContextProvider } from "./MicroserviceContext";
import { ImageNode } from "./ImageNode";

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
  viewport: any;
  onMicroserviceDeleted: (microserviceId: string) => any;
};

let updateValidation = false;

export const MicroservicesDiagram: FC<DiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
  onMicroserviceDeleted,
}) => {
  const { project } = useProjectContext();
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();
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
    (params: Connection) => {
      const newEdge = dispatcher(projectDefinitionActions.addCommunication, { params });

      setEdges((edges) => addEdge(newEdge, edges));
    },
    [dispatcher, setEdges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const changingSource = oldEdge.source !== newConnection.source;
      const changingTarget = oldEdge.target !== newConnection.target;
      if (changingSource || changingTarget) return;

      dispatcher(projectDefinitionActions.updateCommunicationHandles, newConnection);
      setEdges((edges) => updateEdge(oldEdge, newConnection, edges));
    },
    [dispatcher]
  );

  // Handle Microservice Add
  const handleMicroserviceAdd = () => {
    const microserviceNode = dispatcher(projectDefinitionActions.addMicroservice, {
      name: nextName(),
    });

    setNodes((nodes) => [...nodes, microserviceNode]);
  };

  // Handle Microservice Update
  const handleMicroserviceUpdate = (microservice: Microservice) => {
    const {
      new: newServices,
      existing: existingServices,
      removed: removedServices,
    } = findArrayDiff(selectedMicroservice.data.services, microservice.services, (s) => s.id);

    dispatcher(projectDefinitionActions.updateMicroservice, {
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
  const handleMicroserviceDelete = () => {
    const removedMicroserviceId = selectedMicroservice.id;

    dispatcher(projectDefinitionActions.deleteMicroservice, {
      microserviceId: removedMicroserviceId,
    });

    setNodes((ns) => ns.filter((n) => n.id !== removedMicroserviceId));
    setEdges((edgs) =>
      edgs.filter(
        (edge) => removedMicroserviceId !== edge.target && removedMicroserviceId !== edge.source
      )
    );

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
      imageNode: ImageNode,
    }),
    [RemovableMicroserviceNodeWrapper]
  );

  // Handle Communication Update
  const handleCommunicationUpdate = (communication: Communication) => {
    const { new: newServiceIds, removed: removedServiceIds } = findArrayDiff(
      selectedCommunication.data.services,
      communication.services
    );

    dispatcher(projectDefinitionActions.updateCommunication, {
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
  const handleCommunicationDelete = () => {
    dispatcher(projectDefinitionActions.removeCommunication, {
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

  const RemovableEdgeWrapper = useCallback(
    (props: EdgeProps) => {
      const onRemove = (_, id: string) => {
        const edge = projectDefinition.microservices.edges.find((edge) => edge.id === id);
        setSelectedCommunication(edge);
        setIsDeleteCommunicationModalOpen(true);
      };

      return <RemovableEdge onRemove={onRemove} {...props} />;
    },
    [setSelectedCommunication, setIsDeleteCommunicationModalOpen]
  );

  const edgeTypes = useMemo(
    () => ({
      removableEdge: RemovableEdgeWrapper,
    }),
    [RemovableEdgeWrapper]
  );

  const [isPluginsOpen, setIsPluginsOpen] = useState(false);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { microserviceId } = params;
    const microserviceNode = nodes.find((node) => node.id === microserviceId);
    if (!microserviceNode) {
      setIsPluginsOpen(false);
      setSelectedMicroservice(undefined);
      location.pathname.includes("/plugins/") && navigate(`/projects/${project.name}`);
      return;
    }

    setIsPluginsOpen(true);
    setSelectedMicroservice(microserviceNode);
  }, [location, params]);

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
    <>
      {portal}

      <MicroserviceContextProvider>
        <PluginModal
          key={selectedMicroservice?.id}
          microserviceId={selectedMicroservice?.id}
          isOpen={isPluginsOpen}
          isLarge={true}
          onClose={() => {
            setIsPluginsOpen(false);
            setNodes([...projectDefinition.microservices.nodes]);
            navigate(`/projects/${project.name}`);
          }}
        />
      </MicroserviceContextProvider>

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
          nodeTypes={localNodeTypes}
          edgeTypes={edgeTypes}
          onNodeDoubleClick={(_, node) => {
            setSelectedMicroservice(node);
            setInitialState(node.data);
            setDrawerOpen(true);
          }}
          onEdgeDoubleClick={(_, edge) => {
            setSelectedCommunication(edge);
            setInitialState(edge.data);
            setDrawerOpen(true);
          }}
          connectionMode={ConnectionMode.Loose}
          defaultViewport={initialViewport}
          deleteKeyCode={""}
          proOptions={{ account: "paid-sponsor", hideAttribution: true }}
        >
          <MiniMap zoomable pannable />
          <Controls />
          <Background size={0} />
        </ReactFlow>
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
        title={"GN1mbly"}
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
    </>
  );
};
