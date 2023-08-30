import { type FC, useEffect, useState, useCallback } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Node,
  type Viewport,
  useNodesState,
  useOnViewportChange,
} from "reactflow";
import { Class } from "./models";
import { useSequenceGenerator } from "../../../hooks/useStringSequence";
import { Drawer } from "../../../components/drawer";
import { ClassDrawer } from "./ClassDrawer";
import { useProjectContext } from "../../projects/contexts/project.context";
import { useTypesContext } from "./TypesContext";
import nodeTypes from "../common/nodeTypes";
import { ConfirmationModal } from "../../../components/confirmation-modal";

type DiagramProps = {
  microserviceId: string;
  nodes?: any[];
  viewport: any;
};

export const ClassDiagram: FC<DiagramProps> = ({
  microserviceId,
  nodes: initialNodes,
  viewport: initialViewport,
}) => {
  const { projectDefinition } = useProjectContext();
  const { updateTypes } = useTypesContext(microserviceId);

  const [nodes, setNodes, onNodesChange] = useNodesState<Class>(initialNodes || []);
  const nextName = useSequenceGenerator(nodes, (node) => node.data.name, "Class");

  const [selectedClass, setSelectedClass] = useState<Node<Class, string>>();

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    projectDefinition.classes[microserviceId] = {
      ...projectDefinition.classes[microserviceId],
      nodes,
    };
    updateTypes(nodes);
  }, [nodes]);

  useOnViewportChange({
    onEnd: useCallback((viewport: Viewport) => {
      projectDefinition.classes[microserviceId].viewport = { ...viewport };
    }, []),
  });

  const handleClassUpdate = (classObject: Class) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedClass.id) {
          return { ...node, data: classObject };
        }
        return node;
      })
    );
  };

  const onHandleClassDelete = () => {
    setDrawerOpen(false);
    setModalOpen(true);
  };

  const handleClassDelete = () => {
    const deletedClassId = selectedClass.id;
    const classDiagram = projectDefinition.classes[microserviceId];
    const serviceDiagram = projectDefinition.services[microserviceId];

    classDiagram.nodes?.forEach((node) => {
      const methods = node.data.methods;
      methods.forEach((method) => {
        if (method.returnValue === deletedClassId) {
          method.returnValue = "any";
        }

        method.parameters.forEach((parameter) => {
          if (parameter.type === deletedClassId) {
            parameter.type = "any";
          }
        });
      });

      const attributes = node.data.attributes;
      attributes.forEach((attribute) => {
        if (attribute.type === deletedClassId) {
          attribute.type = "any";
        }
      });
    });

    serviceDiagram.nodes.forEach((node) => {
      const functions = node.data.functions;
      functions.forEach((_function) => {
        if (_function.returnType === deletedClassId) {
          _function.returnType = "any";
        }
        _function.params.forEach((param) => {
          if (param.type === deletedClassId) {
            param.type = "any";
          }
        });
      });
    });

    setNodes((ns) => ns.filter((n) => n.id !== deletedClassId));

    setDrawerOpen(false);
    setModalOpen(false);
    setSelectedClass(undefined);
  };

  const onCancelClassDelete = () => {
    setDrawerOpen(true);
    setModalOpen(false);
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="relative left-1/2 -translate-x-1/ top-3 z-10 p-3 rounded-lg border border-gray-200 w-[15%]">
          <div className="flex justify-center gap-x-3">
            <button
              className="hover:opacity-60"
              onClick={() =>
                setNodes((ns) => [
                  ...ns,
                  {
                    id: `${+new Date()}`,
                    position: { x: 0, y: 0 },
                    data: {
                      microserviceId,
                      name: nextName(),
                      methods: [],
                      attributes: [],
                    },
                    type: "classNode",
                  },
                ])
              }
            >
              Add class
            </button>
          </div>
        </div>
        <ReactFlow
          className="validationflow"
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          onNodeDoubleClick={(_, node) => {
            setSelectedClass(node);
            setDrawerOpen(true);
          }}
          defaultViewport={initialViewport}
          proOptions={{ account: "paid-sponsor", hideAttribution: true }}
        >
          <MiniMap zoomable pannable />
          <Controls />
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
          setDrawerOpen(false);
          setSelectedClass(undefined);
        }}
        title={"GN1mbly"}
      >
        {selectedClass && (
          <ClassDrawer
            key={selectedClass.id}
            class={selectedClass.data}
            onClassUpdate={handleClassUpdate}
            onClassDelete={onHandleClassDelete}
            nameExists={(name) =>
              nodes.some((n) => n.id !== selectedClass.id && n.data.name === name)
            }
          />
        )}
      </Drawer>
    </>
  );
};
