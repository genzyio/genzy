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

  return (
    <>
      <div className="h-full w-full">
        <div className="relative left-1/2 -translate-x-1/2 top-3 z-10 p-3 rounded-lg border border-gray-200 w-[20%]">
          <div className="flex justify-between gap-x-3">
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
              Add node
            </button>
            <button className="hover:opacity-60" onClick={() => console.log(nodes)}>
              Log
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
            nameExists={(name) =>
              nodes.some((n) => n.id !== selectedClass.id && n.data.name === name)
            }
          />
        )}
      </Drawer>
    </>
  );
};
