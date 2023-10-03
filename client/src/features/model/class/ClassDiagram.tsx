import { type FC, useEffect, useState, useCallback, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
  type Viewport,
  useNodesState,
  useOnViewportChange,
  NodeProps,
} from "reactflow";
import { Class } from "./models";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { Drawer } from "../../../components/drawer";
import { ClassDrawer } from "./ClassDrawer";
import { useProjectDefinitionContext } from "../../projects/contexts/project-definition.context";
import { projectDefinitionActions } from "../../projects/contexts/project-definition.dispatcher";
import { useTypesContext } from "./TypesContext";
import { ConfirmationModal } from "../../../components/confirmation-modal";
import { ClassNode } from "./ClassNode";
import { RemovableNode } from "../common/components/RemovableNode";
import { Button } from "../../../components/button";
import { createPortal } from "react-dom";
import { RemovableEdge } from "../common/components/RemovableEdge";
import { ValidationContextProvider } from "../common/contexts/validation-context";
import { useDirtyCheckContext } from "../common/contexts/dirty-check-context";
import nodeTypes from "../common/constants/nodeTypes";
import edgeTypes from "../common/constants/edgeTypes";
import { CustomControls } from "../common/components/CustomControls";

type DiagramProps = {
  microserviceId: string;
  nodes?: any[];
  viewport: any;
};

const localEdgeTypes = {
  ...edgeTypes,
  removableEdge: RemovableEdge,
};

export const ClassDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  viewport: initialViewport,
}) => {
  const { projectDefinition, dispatcher } = useProjectDefinitionContext();
  const { isDirty, promptDirtyModal, setInitialState } = useDirtyCheckContext();
  const { updateTypes } = useTypesContext(microserviceId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Class>([...initialNodes] || []);
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Class");

  const [selectedClass, setSelectedClass] = useState<Node<Class, string>>();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    projectDefinition.classes[microserviceId] = {
      ...projectDefinition.classes[microserviceId],
      nodes: [...nodes],
    };
    updateTypes(nodes);
  }, [nodes]);

  useOnViewportChange({
    onEnd: useCallback((viewport: Viewport) => {
      projectDefinition.classes[microserviceId].viewport = { ...viewport };
    }, []),
  });

  // Handle Class add

  const handleClassAdd = () => {
    const classNode = dispatcher(projectDefinitionActions.addClass, {
      microserviceId,
      name: nextName(),
    });

    setNodes((nodes) => [...nodes, classNode]);
  };

  // Handle Class update

  const handleClassUpdate = (classObject: Class) => {
    dispatcher(projectDefinitionActions.updateClass, {
      microserviceId,
      classId: selectedClass.id,
      class: classObject,
    });

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedClass.id) {
          return { ...node, data: classObject };
        }
        return node;
      })
    );

    setDrawerOpen(false);
    setSelectedClass(undefined);
  };

  // Handle Class delete

  const handleClassDelete = () => {
    const deletedClassId = selectedClass.id;
    dispatcher(projectDefinitionActions.deleteClass, { microserviceId, classId: deletedClassId });

    setNodes((nodes) => nodes.filter((node) => node.id !== deletedClassId));

    setModalOpen(false);
    setSelectedClass(undefined);
  };

  const onCancelClassDelete = () => {
    setModalOpen(false);
    setSelectedClass(undefined);
  };

  const RemovableClassNodeWrapper = useCallback(
    (props: NodeProps<Class>) => {
      const onRemove = (_, id: string) => {
        const node = projectDefinition.classes[microserviceId].nodes.find((node) => node.id === id);
        setSelectedClass(node);
        setModalOpen(true);
      };

      return <RemovableNode onRemove={onRemove} element={ClassNode} {...props} />;
    },
    [microserviceId, setSelectedClass, setModalOpen]
  );

  const localNodeTypes = useMemo(
    () => ({
      ...nodeTypes,
      classNode: RemovableClassNodeWrapper,
    }),
    [RemovableClassNodeWrapper]
  );

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
    <>
      {portal}
      <div className="h-full w-full">
        <ReactFlow
          className="validationflow"
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={localNodeTypes}
          edgeTypes={localEdgeTypes}
          onNodeDoubleClick={(_, node) => {
            setSelectedClass(node);
            setInitialState(node.data);
            setDrawerOpen(true);
          }}
          defaultViewport={initialViewport}
          deleteKeyCode={""}
          proOptions={{ account: "paid-sponsor", hideAttribution: true }}
        >
          <MiniMap zoomable pannable />
          <CustomControls />
          <Background size={0} />
        </ReactFlow>
      </div>
      <ConfirmationModal
        title={`Delete ${selectedClass?.data.name}`}
        isOpen={isModalOpen}
        onYes={handleClassDelete}
        onClose={onCancelClassDelete}
      >
        <span>
          Are you sure that you want to delete {selectedClass?.data.name}? By removing{" "}
          {selectedClass?.data.name}, all refferences to it will be updated to type any.
        </span>
      </ConfirmationModal>

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
        title={"GN1mbly"}
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
    </>
  );
};
