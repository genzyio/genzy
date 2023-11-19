import { useEffect } from "react";
import { type Node, useNodesState } from "reactflow";
import { type Class } from "./models";
import { useTypesContext } from "./TypesContext";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";

export const useClassDiagramState = (microserviceId: string, initialNodes: Node<Class>[]) => {
  const { projectDefinition, dispatcher, setExecuteOnUndoRedo } = useProjectDefinitionContext();
  const { updateTypes } = useTypesContext(microserviceId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Class>([...initialNodes]);

  useEffect(() => {
    projectDefinition.classes[microserviceId] = {
      ...projectDefinition.classes[microserviceId],
      nodes: [...nodes],
    };

    updateTypes(nodes); // TODO: Check if this is needed here or somewhere else like on every add/update/remove
  }, [nodes]);

  useEffect(() => {
    setExecuteOnUndoRedo(() => () => {
      const { nodes } = projectDefinition.classes[microserviceId];
      setNodes([...nodes]);
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
    },

    deleteClass: async (classId: string) => {
      await dispatcher(projectDefinitionActions.deleteClass, {
        microserviceId,
        classId,
      });

      setNodes((nodes) => nodes.filter((node) => node.id !== classId));
    },
  };

  return [{ nodes, onNodesChange }, actions] as const;
};
