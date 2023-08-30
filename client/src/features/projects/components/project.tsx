import { type FC, useState } from "react";
import { defaultViewport, useProjectContext } from "../contexts/project.context";
import { EmptyDiagram } from "../../model/EmptyDiagram";
import { ServiceDiagram } from "../../model/service/ServiceDiagram";
import { MicroservicesDiagram } from "../../model/microservices/MicroservicesDiagram";
import { ClassDiagram } from "../../model/class/ClassDiagram";
import { Tabs } from "../../../components/tabs";
import { Tab, type TabProps } from "../../../components/tab";
import { ReactFlowProvider, type NodeProps } from "reactflow";
import { ProjectToolbar } from "./project-toolbar";
import { TypesContextProvider } from "../../model/class/TypesContext";
import { MicroserviceContextProvider } from "../../model/microservices/MicroserviceContext";
import { MicroserviceNodeContextProvider } from "../../model/microservices/MicroserviceNodeContext";

import "../../model/common/validation_styles.css";

const MicroserviceDiagramWrapper: FC = () => {
  const { projectDefinition } = useProjectContext();
  const microserviceDiagram = projectDefinition.microservices;

  return (
    <MicroservicesDiagram
      nodes={microserviceDiagram.nodes}
      edges={microserviceDiagram.edges}
      viewport={microserviceDiagram.viewport || defaultViewport}
    />
  );
};

const ClassDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectContext();
  const classDiagram = projectDefinition.classes[microserviceId];

  return (
    <ClassDiagram
      microserviceId={microserviceId}
      nodes={classDiagram.nodes}
      viewport={classDiagram.viewport || defaultViewport}
    />
  );
};

const ServiceDiagramWrapper: FC<{ microserviceId: string }> = ({ microserviceId }) => {
  const { projectDefinition } = useProjectContext();
  const serviceDiagram = projectDefinition.services[microserviceId];

  return (
    <ServiceDiagram
      microserviceId={microserviceId}
      nodes={serviceDiagram.nodes}
      edges={serviceDiagram.edges}
      viewport={serviceDiagram.viewport || defaultViewport}
    />
  );
};

export const Project: FC = () => {
  const { project, projectDefinition: initialProjectDefinition } = useProjectContext();

  const [tabs, setTabs] = useState<TabProps[]>([]);

  const findMicroserviceName = (microserviceId: string): string => {
    const microserviceNodes = initialProjectDefinition?.microservices?.nodes ?? [];
    const microserviceNode = microserviceNodes.find(
      (node: NodeProps) => node.id === microserviceId
    );

    return microserviceNode?.data?.name ?? "";
  };

  const addTab = (tab: TabProps) => {
    const tabAlreadyOpened = tabs.find((openedTab) => openedTab.title === tab.title);
    if (tabAlreadyOpened) return;

    setTabs([...tabs, tab]);
  };

  const addServiceDiagram = (microserviceId: string) => {
    const microserviceName = findMicroserviceName(microserviceId);
    if (!microserviceName) return;

    const tab = {
      title: `${microserviceName} - Services`,
      children: <ServiceDiagramWrapper microserviceId={microserviceId} />,
    };
    addTab(tab);
  };

  const addModelDiagram = (microserviceId: string) => {
    const microserviceName = findMicroserviceName(microserviceId);
    if (!microserviceName) return;

    const tab = {
      title: `${microserviceName} - Models`,
      children: <ClassDiagramWrapper microserviceId={microserviceId} />,
    };
    addTab(tab);
  };

  if (!project.name) {
    return <EmptyDiagram />;
  }

  return (
    <>
      <ReactFlowProvider>
        <MicroserviceNodeContextProvider
          onModelsClick={addModelDiagram}
          onServicesClick={addServiceDiagram}
        >
          <MicroserviceContextProvider>
            <TypesContextProvider>
              <ProjectToolbar />

              <Tabs>
                <Tab title="Microservices">
                  <MicroserviceDiagramWrapper />
                </Tab>

                {tabs.map((t) => {
                  return (
                    <Tab
                      key={t.title}
                      title={t.title}
                      onClose={({ index }) =>
                        setTabs((tabs) => tabs.filter((_, i) => i + 1 !== index))
                      }
                    >
                      {t.children}
                    </Tab>
                  );
                })}
              </Tabs>
            </TypesContextProvider>
          </MicroserviceContextProvider>
        </MicroserviceNodeContextProvider>
      </ReactFlowProvider>
    </>
  );
};
