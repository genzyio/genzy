import { type FC, useCallback, useEffect, useState, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Controls,
  Background,
  MiniMap,
  type Node,
  type NodeProps,
  type Edge,
  type EdgeProps,
  type Viewport,
  useOnViewportChange,
  ConnectionMode,
  updateEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { type Service } from "./models";
import { Drawer } from "../../../components/drawer";
import { ServiceDrawer } from "./ServiceDrawer";
import { useProjectDefinitionContext } from "../../projects/contexts/project-definition.context";
import nodeTypes from "../common/constants/nodeTypes";
import { createServiceEdge } from "../common/utils/edgeFactories";
import { projectDefinitionActions } from "../../projects/contexts/project-definition.dispatcher";
import { ConfirmationModal } from "../../../components/confirmation-modal";
import { RemovableEdge } from "../common/components/RemovableEdge";
import { ServiceNode } from "./ServiceNode";
import { RemovableNode } from "../common/components/RemovableNode";
import { createPortal } from "react-dom";
import { Button } from "../../../components/button";

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
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    (params: Connection) => setEdges((eds) => addEdge(createServiceEdge(params), eds)),
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

  // Handle Service add

  const handleServiceAdd = () => {
    const serviceNode = dispatcher(projectDefinitionActions.addService, {
      microserviceId,
      service: {
        id: `${+new Date()}`,
        name: nextName(),
        type: "CONTROLLER",
      },
    });
    setNodes((nds) => [...nds, serviceNode]);
  };

  // Handle Service update

  const handleServiceUpdate = (service: Service) => {
    dispatcher(projectDefinitionActions.updateService, {
      microserviceId,
      service: {
        id: selected.id,
        ...service,
      },
    });

    setNodes((ns) =>
      ns.map((n) => {
        if (n.id === selected.id) n.data = service;
        return n;
      })
    );
  };

  // Handle Service delete

  const handleServiceDelete = () => {
    const removedServiceId = selected.id;

    dispatcher(projectDefinitionActions.updateMicroservice, {
      microserviceId: microserviceId,
      newServices: [],
      existingServices: [],
      removedServices: [{ id: removedServiceId }],
    });

    setNodes((ns) => ns.filter((n) => n.id !== removedServiceId));
    setEdges((edgs) =>
      edgs.filter((edge) => removedServiceId !== edge.target && removedServiceId !== edge.source)
    );

    setIsModalOpen(false);
    setSelected(undefined);
  };

  const onCancelServiceDelete = () => {
    setIsModalOpen(false);
    setSelected(undefined);
  };

  const RemovableServiceNodeWrapper = useCallback(
    (props: NodeProps<Service>) => {
      const onRemove = (_, id: string) => {
        const node = projectDefinition.services[microserviceId].nodes.find(
          (node) => node.id === id
        );
        setSelected(node);
        setIsModalOpen(true);
      };

      return <RemovableNode onRemove={onRemove} element={ServiceNode} {...props} />;
    },
    [microserviceId, setSelected, setIsModalOpen]
  );

  const localNodeTypes = useMemo(
    () => ({
      ...nodeTypes,
      serviceNode: RemovableServiceNodeWrapper,
    }),
    [RemovableServiceNodeWrapper]
  );

  const RemovableEdgeWrapper = useCallback(
    (props: EdgeProps) => {
      const onRemove = (_, id: string) => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
      };

      return <RemovableEdge onRemove={onRemove} {...props} />;
    },
    [setEdges]
  );

  const edgeTypes = useMemo(
    () => ({
      removableEdge: RemovableEdgeWrapper,
    }),
    [RemovableEdgeWrapper]
  );

  const elem = document.getElementById("toolbar-actions");

  const portal = useMemo(() => {
    if (elem) {
      return createPortal(
        <div className="flex justify-center gap-x-3">
          <Button className="hover:opacity-60 text-xs px-1 py-1" onClick={handleServiceAdd}>
            Add service
          </Button>
        </div>,
        elem
      );
    }
  }, [elem]);

  return (
    <>
      {portal}
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
          onNodeClick={() => {}}
          onNodeDoubleClick={(_e, node) => {
            if (node.data.type === "REMOTE_PROXY") return;
            setSelected(node);
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
        title={`Delete ${selected?.data?.name}`}
        isOpen={isModalOpen}
        onYes={handleServiceDelete}
        onClose={onCancelServiceDelete}
      >
        <span>
          Are you sure that you want to delete {selected?.data?.name}. By deleting{" "}
          {selected?.data?.name}, all references will be removed.
        </span>
      </ConfirmationModal>

      <Drawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} title={"GN1mbly"}>
        {selected && (
          <ServiceDrawer
            service={selected.data}
            updateService={handleServiceUpdate}
            nameExists={(name) => nodes.some((n) => n.id !== selected.id && n.data.name === name)}
          />
        )}
      </Drawer>
    </>
  );
};
