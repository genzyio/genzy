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
} from "reactflow";
import { Communication, type Microservice } from "./models";
import { Drawer } from "../../../components/drawer";
import { MicroserviceDrawer } from "./MicroserviceDrawer";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { CommunicationDrawer } from "./CommunicationDrawer";
import { useProjectContext } from "../../projects/contexts/project.context";
import nodeTypes from "../common/constants/nodeTypes";
import { findArrayDiff } from "../../../utils/diff";
import { ConfirmationModal } from "../../../components/confirmation-modal";
import {
  createMicroserviceNode,
  createRemoteProxyNode,
  createServiceNode,
} from "../common/utils/nodeFactories";
import { createMicroserviceEdge } from "../common/utils/edgeFactories";

type DiagramProps = {
  nodes?: any[];
  edges?: any[];
  viewport: any;
  onMicroserviceDeleted: (microserviceName: string) => any;
};

let updateValidation = false;

export const MicroservicesDiagram: FC<DiagramProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
  onMicroserviceDeleted,
}) => {
  const { projectDefinition, addMicroservice } = useProjectContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Microservice>(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Communication>(initialEdges || []);
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
    (params: Connection) => setEdges((eds) => addEdge(createMicroserviceEdge(params), eds)),
    [setEdges]
  );

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: Connection) => {
    const changingSource = oldEdge.source !== newConnection.source;
    const changingTarget = oldEdge.target !== newConnection.target;
    if (changingSource || changingTarget) return;

    setEdges((eds) => updateEdge(oldEdge, newConnection, eds));
  }, []);

  const handleMicroserviceAdd = () => {
    const newMicroserviceNode = createMicroserviceNode({ name: nextName() });

    setNodes((nodes) => [...nodes, newMicroserviceNode]);
    addMicroservice(newMicroserviceNode.id);
  };

  const handleMicroserviceUpdate = (microservice: Microservice) => {
    const {
      new: newServices,
      existing: existingServices,
      removed: removedServices,
    } = findArrayDiff(selectedMicroservice.data.services, microservice.services, (s) => s.id);
    const serviceDiagram = projectDefinition.services[selectedMicroservice.id];

    // NAME & TYPE CHANGE
    existingServices.forEach((existingService) => {
      const existingServiceNode = serviceDiagram.nodes.find(
        (node) => node.id == existingService.id
      );
      existingServiceNode.data.name = existingService.name;
      existingServiceNode.data.type = existingService.type;
    });

    // NEW SERVICES
    newServices.forEach((newService) => {
      const newServiceNode = createServiceNode({
        serviceId: newService.id,
        microserviceId: selectedMicroservice.id,
        name: newService.name,
        type: newService.type,
      });

      serviceDiagram.nodes.push(newServiceNode);
    });

    // DELETE SERVICES FROM CURRENT MS DIAGRAM
    serviceDiagram.nodes = serviceDiagram.nodes.filter((service) =>
      removedServices.every((removedService) => removedService.id !== service.id)
    );

    // DELETE SERVICE EDGES FROM CURRENT MS DIAGRAM
    serviceDiagram.edges = serviceDiagram.edges.filter((edge) => {
      return removedServices.every(
        (removedService) => removedService.id !== edge.target && removedService.id !== edge.source
      );
    });

    // DELETE REMOTE PROXIES, LINES AND UPDATE COMMUNICATION
    const dependentCommunication = edges.filter((edge) => edge.target === selectedMicroservice.id);
    dependentCommunication.forEach((communication) => {
      communication.data.services = communication.data.services.filter((service) => {
        return removedServices.every((removedService) => removedService.id !== service);
      });
    });

    const dependentMicroservices = dependentCommunication.map((edge) => edge.source);
    dependentMicroservices.forEach((microserviceId) => {
      const dependentServiceDiagram = projectDefinition.services[microserviceId];
      dependentServiceDiagram.nodes = dependentServiceDiagram.nodes.filter((service) =>
        removedServices.every((removedService) => removedService.id !== service.id)
      );

      dependentServiceDiagram.edges = dependentServiceDiagram.edges.filter((edge) => {
        return removedServices.every((removedService) => removedService.id !== edge.target);
      });
    });

    // NODE UPDATE
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

  const handleCommunicationUpdate = (communication: Communication) => {
    const { new: newServices, removed: removedServices } = findArrayDiff(
      selectedCommunication.data.services,
      communication.services
    );
    const communicationEdge = edges.find((edge) => edge.id === selectedCommunication.id);
    const serviceDiagram = projectDefinition.services[communicationEdge.source];

    newServices.forEach((newService) => {
      const newRemoteProxy = createRemoteProxyNode({
        serviceId: newService,
        microserviceId: communicationEdge.target,
      });

      serviceDiagram.nodes.push(newRemoteProxy);
    });

    serviceDiagram.nodes = serviceDiagram.nodes.filter((service) =>
      removedServices.every((removedServiceId) => removedServiceId !== service.id)
    );

    serviceDiagram.edges = serviceDiagram.edges.filter((edge) => {
      return removedServices.every((removedServicesId) => removedServicesId !== edge.target);
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
  const onHandleCommunicationDelete = () => {
    setDrawerOpen(false);
    setIsDeleteCommunicationModalOpen(true);
  };

  const handleCommunicationDelete = () => {
    const serviceDiagram = projectDefinition.services[selectedCommunication.source];
    const removedServices = selectedCommunication.data.services;

    serviceDiagram.nodes = serviceDiagram.nodes.filter((service) =>
      removedServices.every((removedServiceId) => removedServiceId !== service.id)
    );

    serviceDiagram.edges = serviceDiagram.edges.filter((edge) => {
      return removedServices.every((removedServicesId) => removedServicesId !== edge.target);
    });

    setEdges((edges) => edges.filter((edge) => edge.id !== selectedCommunication.id));

    setDrawerOpen(false);
    setIsDeleteCommunicationModalOpen(false);
    setSelectedCommunication(undefined);
  };

  const onCancelCommunicationDelete = () => {
    setDrawerOpen(true);
    setIsDeleteCommunicationModalOpen(false);
  };

  // Handle Microservice Delete
  const onHandleMicroserviceDelete = () => {
    setDrawerOpen(false);
    setIsDeleteMicroserviceModalOpen(true);
  };

  const handleMicroserviceDelete = () => {
    const removedMicroserviceId = selectedMicroservice.id;
    const removedServices = selectedMicroservice.data.services;

    // DELETE REMOTE PROXIES AND LINES TO THEM FROM DEPENDENT MS
    const dependentCommunication = edges.filter((edge) => edge.target === removedMicroserviceId);
    const dependentMicroservices = dependentCommunication.map((edge) => edge.source);
    dependentMicroservices.forEach((microserviceId) => {
      const dependentServiceDiagram = projectDefinition.services[microserviceId];
      dependentServiceDiagram.nodes = dependentServiceDiagram.nodes.filter((service) =>
        removedServices.every((removedService) => removedService.id !== service.id)
      );

      dependentServiceDiagram.edges = dependentServiceDiagram.edges.filter((edge) => {
        return removedServices.every((removedService) => removedService.id !== edge.target);
      });
    });

    // DELETE EDGES AND NODES FROM MS DIAGRAM
    setEdges((edgs) =>
      edgs.filter(
        (edge) => removedMicroserviceId !== edge.target && removedMicroserviceId !== edge.source
      )
    );

    setNodes((ns) => ns.filter((n) => n.id !== removedMicroserviceId));

    // DELETE SERVICES AND CLASSES OBJECTS
    delete projectDefinition.services[removedMicroserviceId];
    delete projectDefinition.classes[removedMicroserviceId];

    onMicroserviceDeleted(selectedMicroservice.data.name);

    setDrawerOpen(false);
    setIsDeleteMicroserviceModalOpen(false);
    setSelectedMicroservice(undefined);
  };

  const onCancelMicroserviceDelete = () => {
    setDrawerOpen(true);
    setIsDeleteMicroserviceModalOpen(false);
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="absolute left-1/2 -translate-x-1/2 top-3 z-10 p-1 rounded-lg border border-gray-200 w-[12%]">
          <div className="flex justify-center gap-x-3">
            <button className="hover:opacity-60" onClick={handleMicroserviceAdd}>
              Add microservice
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
            onMicroserviceDelete={onHandleMicroserviceDelete}
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
            onCommunicationDelete={onHandleCommunicationDelete}
            possibleServices={possibleServicesForCommunication}
          />
        )}
      </Drawer>
    </>
  );
};
