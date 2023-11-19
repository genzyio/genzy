import { type FC, useCallback, useEffect, useState, useMemo } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  type Node,
  type NodeProps,
  type EdgeProps,
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
    serviceEventEmitter.dispatch(ServiceEvents.ON_EDGE_REMOVE, {
      dependencyId: id,
      microserviceId,
    });
  };

  return <RemovableEdge nodes={nodes} edges={edges} onRemove={onRemove} {...props} />;
};

const localEdgeTypes = {
  ...edgeTypes,
  defaultEdge: DefaultEdgeWrapper,
  removableEdge: RemovableEdgeWrapper,
};

type DiagramProps = {
  microserviceId: string;
  nodes?: any[];
  edges?: any[];
  viewport: any;
};

export const ServiceDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  edges: initialEdges,
  viewport: initialViewport,
}) => {
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Service>([...initialNodes] || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{}>([...initialEdges] || []);

  const [selected, setSelected] = useState<Node<Service, string>>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    projectDefinition.services[microserviceId] = {
      ...projectDefinition.services[microserviceId],
      nodes: [...nodes],
      edges: [...edges],
    };
  }, [nodes, edges]);

  useEffect(() => {
    setExecuteOnUndoRedo(() => () => {
      const { nodes, edges } = projectDefinition.services[microserviceId];
      setNodes([...nodes]);
      setEdges([...edges]);
    });

    return () => setExecuteOnUndoRedo(() => () => {});
  }, [setNodes, setEdges]);

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

  const onConnect = useCallback(
    async (params: Connection) => {
      const newEdge = await dispatcher(projectDefinitionActions.addDependency, {
        microserviceId,
        params,
      });

      setEdges((edges) => addEdge(newEdge, edges));
    },
    [microserviceId, dispatcher, setEdges]
  );

  const nextName = () => {
    let i = 1;
    while (nodes.find((n) => n.data.name === `Service${i}`)) i++;
    return `Service${i}`;
  };

  // Handle Service add

  const handleServiceAdd = async () => {
    const serviceNode = await dispatcher(projectDefinitionActions.addService, {
      microserviceId,
      service: {
        id: `${+new Date()}`,
        name: nextName(),
        type: "CONTROLLER",
      },
    });
    setNodes((nodes) => [...nodes, serviceNode]);
  };

  // Handle Service update

  const handleServiceUpdate = async (service: Service) => {
    await dispatcher(projectDefinitionActions.updateService, {
      microserviceId,
      service: {
        id: selected.id,
        ...service,
      },
      functions: service.functions,
    });

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selected.id) return { ...node, data: service };
        return node;
      })
    );

    setDrawerOpen(false);
    setSelected(undefined);
  };

  // Handle Service delete
  const [removeServiceModalInstance, setRemoveServiceModalInstance] =
    useState<RemoveServiceModalInstance>();

  const handleServiceDelete = async (service: Node<Service>) => {
    await dispatcher(projectDefinitionActions.deleteService, {
      microserviceId,
      serviceId: service.id,
    });

    setNodes((nodes) => nodes.filter((node) => node.id !== service.id));
    setEdges((edges) =>
      edges.filter((edge) => service.id !== edge.target && service.id !== edge.source)
    );
  };

  useEffect(() => {
    serviceEventEmitter.subscribe(ServiceEvents.ON_NODE_REMOVE, (node) => {
      removeServiceModalInstance.openFor(node);
    });
    return () => serviceEventEmitter.unsubscribe(ServiceEvents.ON_NODE_REMOVE);
  }, [removeServiceModalInstance]);

  useEffect(() => {
    serviceEventEmitter.subscribe(ServiceEvents.ON_EDGE_REMOVE, (removedEdge) => {
      dispatcher(projectDefinitionActions.removeDependency, removedEdge);
      setEdges((edges) => edges.filter((edge) => edge.id !== removedEdge.dependencyId));
    });
    return () => serviceEventEmitter.unsubscribe(ServiceEvents.ON_EDGE_REMOVE);
  }, [microserviceId, dispatcher, setEdges]);

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
          onConnect={onConnect}
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
