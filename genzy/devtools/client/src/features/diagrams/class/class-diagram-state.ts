import { useEffect } from "react";
import { type Node, type Edge, useNodesState, useEdgesState } from "reactflow";
import { type Class } from "./models";
import { useTypesContext } from "./TypesContext";
import { useProjectDefinitionContext } from "@features/project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "@features/project-workspace/contexts/project-definition.dispatcher";

export const useClassDiagramState = (
  microserviceId: string,
  initialNodes: Node<Class>[],
  initialEdges: Edge<any>[]
) => {
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();
  const { updateTypes } = useTypesContext(microserviceId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Class>([...initialNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<unknown>([...initialEdges]);

  useEffect(() => {
    projectDefinition.classes[microserviceId] = {
      ...projectDefinition.classes[microserviceId],
      nodes: [...nodes],
      edges: [...edges],
    };
  }, [nodes, edges]);

  useEffect(() => {
    updateTypes(nodes); // TODO: Check if this is needed here or somewhere else like on every add/update/remove
  }, [nodes]);

  useEffect(() => {
    setExecuteOnUndoRedo(() => () => {
      const { nodes, edges } = projectDefinition.classes[microserviceId];
      setNodes([...nodes]);
      setEdges([...edges]);
    });

    return () => setExecuteOnUndoRedo(() => () => {});
  }, [setNodes]);

  const actions = {
    addClass: async (className: string) => {
      const classNode = await dispatcher(projectDefinitionActions.addClass, {
        microserviceId,
        name: className,
      });

      setNodes((nodes) => [...nodes, classNode]);
    },

    updateClass: async (classId: string, _class: Class) => {
      await dispatcher(projectDefinitionActions.updateClass, {
        microserviceId,
        classId,
        class: _class,
      });

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === classId) {
            return { ...node, data: _class };
          }
          return node;
        })
      );
      setEdges([...projectDefinition.classes[microserviceId].edges]);
    },

    deleteClass: async (classId: string) => {
      await dispatcher(projectDefinitionActions.deleteClass, {
        microserviceId,
        classId,
      });

      setNodes((nodes) => nodes.filter((node) => node.id !== classId));
      setEdges((edges) =>
        edges.filter((edge) => edge.source !== classId && edge.target !== classId)
      );
    },
  };

  return [{ nodes, onNodesChange, edges, onEdgesChange }, actions] as const;
};
