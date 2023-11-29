import { type FC, useEffect, useState, useMemo } from "react";
import {
  Connection,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
  type Viewport,
} from "reactflow";
import "reactflow/dist/style.css";
import { type Service } from "./models";
import { Drawer } from "../../../core/components/drawer";
import { ServiceDrawer } from "./service-drawer/ServiceDrawer";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";
import { RemovableEdge } from "../common/components/edges/removable/RemovableEdge";
import { ServiceNode } from "./nodes/ServiceNode";
import { RemovableNode } from "../common/components/nodes/RemovableNode";
import { createPortal } from "react-dom";
import { Button } from "../../../core/components/button";
import { ValidationContextProvider } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import nodeTypes from "../common/constants/nodeTypes";
import edgeTypes from "../common/constants/edgeTypes";
import { isNodeMoved } from "../common/utils/move.utils";
import { FloatingEdge } from "../common/components/edges/floating/FloatingEdge";
import { darkTheme } from "../../../core/components/diagram";
import { ThemeProvider } from "styled-components";
import { DiagramBase } from "../common/components/diagram/DiagramBase";
import { useMicroserviceContext } from "../common/contexts/microservice.context";
import { ServiceEvents, serviceEventEmitter } from "./service-diagram.events";
import { RemoveServiceModal, type RemoveServiceModalInstance } from "./RemoveServiceModal";
import { useSequenceGenerator } from "../../../core/hooks/useStringSequence";
import { useServiceDiagramState } from "./service-diagram-state";

type DiagramProps = {
  microserviceId: string;
  nodes?: Node<Service>[];
  edges?: Edge<any>[];
  viewport: Viewport;
};

export const ServiceDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
}) => {
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();

  const [{ nodes, edges, onNodesChange, onEdgesChange }, actions] = useServiceDiagramState(
    microserviceId,
    initialNodes || [],
    initialEdges || []
  );
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Service");

  const [removeServiceModalInstance, setRemoveServiceModalInstance] =
    useState<RemoveServiceModalInstance>();

  const [selected, setSelected] = useState<Node<Service, string>>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const isValidConnection = (connection: Connection) => {
    const selfConnecting = connection.source === connection.target;
    if (selfConnecting) return false;

    const sourceNodeType = nodes.find((node) => node.id === connection.source).data.type;
    if (["REMOTE_PROXY", "PLUGABLE_SERVICE", "API_INTEGRATION"].includes(sourceNodeType)) return;

    const alreadyConnected = edges.some(
      (edge) => edge.target === connection.target && edge.source === connection.source
    );
    if (alreadyConnected) return false;

    return true;
  };

  useEffect(() => {
    serviceEventEmitter.subscribe(ServiceEvents.ON_NODE_REMOVE, (node) => {
      removeServiceModalInstance.openFor(node);
    });

    serviceEventEmitter.subscribe(ServiceEvents.ON_EDGE_REMOVE, async (edge) => {
      handleDeleteDependency(edge);
    });

    return () => {
      serviceEventEmitter.unsubscribe(ServiceEvents.ON_NODE_REMOVE);
      serviceEventEmitter.unsubscribe(ServiceEvents.ON_EDGE_REMOVE);
    };
  }, [removeServiceModalInstance]);

  // Service Handlers
  const handleServiceAdd = async () => {
    await actions.addService(nextName());
  };

  const handleServiceUpdate = async (service: Service) => {
    await actions.updateService(selected.id, service);

    setDrawerOpen(false);
    setSelected(undefined);
  };

  const handleServiceDelete = async (service: Node<Service>) => {
    await actions.deleteService(service.id);
  };

  // Dependency Handlers
  const handleAddDependency = actions.addDependency;

  const handleDeleteDependency = async (dependency: Edge<any>) => {
    await actions.deleteDependency(dependency.id);
  };

  // Toolbar action
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
  }, [elem, handleServiceAdd]);

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
          onConnect={handleAddDependency}
          nodeTypes={localNodeTypes}
          edgeTypes={localEdgeTypes}
          onViewportChanged={(viewport) =>
            (projectDefinition.services[microserviceId].viewport = { ...viewport })
          }
          onNodeMoved={async (nodeBeforeMove, nodeAfterMove) => {
            if (isNodeMoved(nodeBeforeMove, nodeAfterMove)) {
              await dispatcher(projectDefinitionActions.serviceMoved, {
                microserviceId,
                serviceId: nodeBeforeMove?.id,
                position: nodeAfterMove.position,
                positionAbsolute: nodeAfterMove.positionAbsolute,
              });
            }
          }}
          onNodeDoubleClick={(_e, node) => {
            if (["REMOTE_PROXY", "PLUGABLE_SERVICE"].includes(node.data.type)) return;
            setSelected(node);
            setInitialState(node.data);
            setDrawerOpen(true);
          }}
          defaultViewport={initialViewport}
        />
      </div>

      <RemoveServiceModal
        onInit={setRemoveServiceModalInstance}
        handleRemove={handleServiceDelete}
      />

      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          if (!isDirty) {
            setDrawerOpen(false);
            setSelected(undefined);
            return;
          }

          setDrawerOpen(false);
          promptDirtyModal(
            () => {
              setDrawerOpen(false);
              setSelected(undefined);
            },
            () => {
              setDrawerOpen(true);
            }
          );
        }}
        title={"Service"}
      >
        {selected && (
          <ValidationContextProvider>
            <ServiceDrawer
              key={selected.id}
              serviceId={selected.id}
              service={selected.data}
              updateService={handleServiceUpdate}
              nameExists={(name) => nodes.some((n) => n.id !== selected.id && n.data.name === name)}
            />
          </ValidationContextProvider>
        )}
      </Drawer>
    </ThemeProvider>
  );
};

// Nodes
const RemovableServiceNodeWrapper: FC<NodeProps<Service>> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { microserviceId } = useMicroserviceContext();

  const onRemove = (_, id: string) => {
    const node = projectDefinition.services[microserviceId].nodes.find((node) => node.id === id);
    serviceEventEmitter.dispatch(ServiceEvents.ON_NODE_REMOVE, node);
  };

  return <RemovableNode onRemove={onRemove} element={ServiceNode} {...props} />;
};

const localNodeTypes = {
  ...nodeTypes,
  serviceNode: RemovableServiceNodeWrapper,
};

// Edges

const DefaultEdgeWrapper: FC<EdgeProps> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { microserviceId } = useMicroserviceContext();
  const { nodes, edges } = projectDefinition.services[microserviceId];

  return <FloatingEdge nodes={nodes} edges={edges} {...props} label={undefined} />;
};

const RemovableEdgeWrapper: FC<EdgeProps> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { microserviceId } = useMicroserviceContext();
  const { nodes, edges } = projectDefinition.services[microserviceId];

  const onRemove = (_, id: string) => {
    const edge = projectDefinition.services[microserviceId].edges.find((edge) => edge.id === id);
    serviceEventEmitter.dispatch(ServiceEvents.ON_EDGE_REMOVE, edge);
  };

  return <RemovableEdge nodes={nodes} edges={edges} onRemove={onRemove} {...props} />;
};

const localEdgeTypes = {
  ...edgeTypes,
  defaultEdge: DefaultEdgeWrapper,
  removableEdge: RemovableEdgeWrapper,
};
