import { useEffect } from "react";
import { type Node, type Edge, useNodesState, useEdgesState, Connection, addEdge } from "reactflow";
import { type Microservice, type Communication } from "./models";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";
import { findArrayDiff } from "../../../core/utils/diff";

export const useMicroservicesDiagramState = (
  initialNodes: Node<Microservice>[],
  initialEdges: Edge<Communication>[]
) => {
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();

  const [nodes, setNodes, onNodesChange] = useNodesState<Microservice>([...initialNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Communication>([...initialEdges]);

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

  const actions = {
    reinitialize: () => {
      const { nodes, edges } = projectDefinition.microservices;
      setNodes([...nodes]);
      setEdges([...edges]);
    },

    addCommunication: async (params: Connection) => {
      const newEdge = await dispatcher(projectDefinitionActions.addCommunication, { params });

      setEdges((edges) => addEdge(newEdge, edges));
    },

    updateCommunication: async (
      communicationId: string,
      oldCommunication: Communication,
      newCommunication: Communication
    ) => {
      const { new: newServiceIds, removed: removedServiceIds } = findArrayDiff(
        oldCommunication.services,
        newCommunication.services
      );

      await dispatcher(projectDefinitionActions.updateCommunication, {
        communicationId,
        communication: newCommunication,
        newServiceIds,
        removedServiceIds,
      });

      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === communicationId) {
            return { ...edge, data: newCommunication };
          }
          return edge;
        })
      );
    },

    deleteCommunication: async (communicationId: string) => {
      await dispatcher(projectDefinitionActions.removeCommunication, {
        communicationId,
      });

      setEdges((edges) => edges.filter((edge) => edge.id !== communicationId));
    },

    addMicroservice: async (microserviceName: string) => {
      const microserviceNode = await dispatcher(projectDefinitionActions.addMicroservice, {
        name: microserviceName,
      });

      setNodes((nodes) => [...nodes, microserviceNode]);
    },

    updateMicroservice: async (
      microserviceId: string,
      oldMicroservice: Microservice,
      newMicroservice: Microservice
    ) => {
      const {
        new: newServices,
        existing: existingServices,
        removed: removedServices,
      } = findArrayDiff(
        oldMicroservice.services,
        newMicroservice.services,
        (service) => service.id
      );

      await dispatcher(projectDefinitionActions.updateMicroservice, {
        microserviceId,
        microservice: newMicroservice,
        newServices,
        existingServices,
        removedServices,
      });

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === microserviceId) {
            return { ...node, data: newMicroservice };
          }
          return node;
        })
      );
    },

    deleteMicroservice: async (microserviceId: string) => {
      await dispatcher(projectDefinitionActions.deleteMicroservice, {
        microserviceId,
      });

      const { nodes, edges } = projectDefinition.microservices;
      setNodes([...nodes]);
      setEdges([...edges]);
    },
  };

  return [{ nodes, edges, onNodesChange, onEdgesChange }, actions] as const;
};
