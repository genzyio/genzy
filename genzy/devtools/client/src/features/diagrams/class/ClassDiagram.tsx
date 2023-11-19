import { type FC, useEffect, useState, useMemo } from "react";
import { type Node, type NodeProps, type Viewport, SmoothStepEdge } from "reactflow";
import { Class } from "./models";
import { useSequenceGenerator } from "../../../core/hooks/useStringSequence";
import { Drawer } from "../../../core/components/drawer";
import { ClassDrawer } from "./class-drawer/ClassDrawer";
import { useProjectDefinitionContext } from "../../project-workspace/contexts/project-definition.context";
import { projectDefinitionActions } from "../../project-workspace/contexts/project-definition.dispatcher";
import { ClassNode } from "./nodes/ClassNode";
import { RemovableNode } from "../common/components/nodes/RemovableNode";
import { Button } from "../../../core/components/button";
import { createPortal } from "react-dom";
import { ValidationContextProvider } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import nodeTypes from "../common/constants/nodeTypes";
import edgeTypes from "../common/constants/edgeTypes";
import { isNodeMoved } from "../common/utils/move.utils";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "../../../core/components/diagram";
import { DiagramBase } from "../common/components/diagram/DiagramBase";
import { useMicroserviceContext } from "../common/contexts/microservice.context";
import { ClassEvents, classEventEmitter } from "./class-diagram.events";
import { RemoveClassModal, RemoveClassModalInstance } from "./RemoveClassModal";
import { useClassDiagramState } from "./class-diagram-state";

type DiagramProps = {
  microserviceId: string;
  nodes?: Node<Class>[];
  viewport: Viewport;
};

export const ClassDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  viewport: initialViewport,
}) => {
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();

  const [{ nodes, onNodesChange }, actions] = useClassDiagramState(
    microserviceId,
    initialNodes || []
  );
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Class");

  const [removeClassModalInstance, setRemoveClassModalInstance] =
    useState<RemoveClassModalInstance>();

  const [selectedClass, setSelectedClass] = useState<Node<Class, string>>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    classEventEmitter.subscribe(ClassEvents.ON_NODE_REMOVE, (node) => {
      removeClassModalInstance.openFor(node);
    });

    return () => classEventEmitter.unsubscribe(ClassEvents.ON_NODE_REMOVE);
  }, [removeClassModalInstance]);

  // Class handlers
  const handleClassAdd = async () => {
    await actions.addClass(nextName());
  };

  const handleClassUpdate = async (_class: Class) => {
    await actions.updateClass(selectedClass.id, _class);

    setDrawerOpen(false);
    setSelectedClass(undefined);
  };

  const handleClassDelete = async (_class: Node<Class>) => {
    await actions.deleteClass(_class.id);
  };

  // Toolbar action
  const elem = document.getElementById("toolbar-actions");
  const portal = useMemo(() => {
    if (elem) {
      return createPortal(
        <div className="flex justify-center gap-x-3">
          <Button className="hover:opacity-60 text-xs px-1 py-1" onClick={handleClassAdd}>
            Add class
          </Button>
        </div>,
        elem
      );
    }
  }, [elem, handleClassAdd]);

  return (
    <ThemeProvider theme={darkTheme}>
      {portal}
      <div className="h-full w-full">
        <DiagramBase
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={localNodeTypes}
          edgeTypes={localEdgeTypes}
          onViewportChanged={(viewport) =>
            (projectDefinition.classes[microserviceId].viewport = { ...viewport })
          }
          onNodeMoved={async (nodeBeforeMove, nodeAfterMove) => {
            if (isNodeMoved(nodeBeforeMove, nodeAfterMove)) {
              await dispatcher(projectDefinitionActions.classMoved, {
                microserviceId,
                classId: nodeBeforeMove?.id,
                position: nodeAfterMove.position,
                positionAbsolute: nodeAfterMove.positionAbsolute,
              });
            }
          }}
          onNodeDoubleClick={(_, node) => {
            setSelectedClass(node);
            setInitialState(node.data);
            setDrawerOpen(true);
          }}
          defaultViewport={initialViewport}
          supportsConnection={false}
        />
      </div>

      <RemoveClassModal onInit={setRemoveClassModalInstance} handleRemove={handleClassDelete} />

      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          if (!isDirty) {
            setDrawerOpen(false);
            setSelectedClass(undefined);
            return;
          }

          setDrawerOpen(false);
          promptDirtyModal(
            () => {
              setDrawerOpen(false);
              setSelectedClass(undefined);
            },
            () => {
              setDrawerOpen(true);
            }
          );
        }}
        title={"Class"}
      >
        {selectedClass && (
          <ValidationContextProvider>
            <ClassDrawer
              key={selectedClass.id}
              classId={selectedClass.id}
              class={selectedClass.data}
              onClassUpdate={handleClassUpdate}
              nameExists={(name) =>
                nodes.some((n) => n.id !== selectedClass.id && n.data.name === name)
              }
            />
          </ValidationContextProvider>
        )}
      </Drawer>
    </ThemeProvider>
  );
};

// Nodes
const RemovableClassNodeWrapper: FC<NodeProps<Class>> = (props) => {
  const { projectDefinition } = useProjectDefinitionContext();
  const { microserviceId } = useMicroserviceContext();

  const onRemove = (_, id: string) => {
    const node = projectDefinition.classes[microserviceId].nodes.find((node) => node.id === id);
    classEventEmitter.dispatch(ClassEvents.ON_NODE_REMOVE, node);
  };

  return <RemovableNode onRemove={onRemove} element={ClassNode} {...props} />;
};

const localNodeTypes = {
  ...nodeTypes,
  classNode: RemovableClassNodeWrapper,
};

// Edges
const localEdgeTypes = {
  ...edgeTypes,
  defaultEdge: SmoothStepEdge,
  removableEdge: SmoothStepEdge,
};
