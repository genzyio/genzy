import { useEffect } from "react";
import { type Node, type Edge, useNodesState, useEdgesState, Connection, addEdge } from "reactflow";
import { type Service } from "./models";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";

export const useServiceDiagramState = (
  microserviceId: string,
  initialNodes: Node<Service>[],
  initialEdges: Edge<any>[]
) => {
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Service>([...initialNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{}>([...initialEdges]);

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

  const actions = {
    addDependency: async (params: Connection) => {
      const newEdge = await dispatcher(projectDefinitionActions.addDependency, {
        microserviceId,
        params,
      });

      setEdges((edges) => addEdge(newEdge, edges));
    },

    deleteDependency: async (dependencyId: string) => {
      await dispatcher(projectDefinitionActions.removeDependency, {
        microserviceId,
        dependencyId,
      });
      setEdges((edges) => edges.filter((edge) => edge.id !== dependencyId));
    },

    addService: async (serviceName: string) => {
      const serviceNode = await dispatcher(projectDefinitionActions.addService, {
        microserviceId,
        service: {
          id: `${+new Date()}`,
          name: serviceName,
          type: "CONTROLLER",
        },
      });
      setNodes((nodes) => [...nodes, serviceNode]);
    },

    updateService: async (serviceId: string, service: Service) => {
      await dispatcher(projectDefinitionActions.updateService, {
        microserviceId,
        service: {
          id: serviceId,
          ...service,
        },
        functions: service.functions,
      });

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === serviceId) return { ...node, data: service };
          return node;
        })
      );
    },

    deleteService: async (serviceId: string) => {
      await dispatcher(projectDefinitionActions.deleteService, {
        microserviceId,
        serviceId: serviceId,
      });

      setNodes((nodes) => nodes.filter((node) => node.id !== serviceId));
      setEdges((edges) =>
        edges.filter((edge) => serviceId !== edge.target && serviceId !== edge.source)
      );
    },
  };

  return [{ nodes, edges, onNodesChange, onEdgesChange }, actions] as const;
};
