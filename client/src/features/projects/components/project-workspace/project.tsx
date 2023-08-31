import { type FC, useState, useCallback } from "react";
import { useProjectContext } from "../../contexts/project.context";
import { EmptyDiagram } from "../../../model/EmptyDiagram";
import { Tabs } from "../../../../components/tabs";
import { Tab, type TabProps } from "../../../../components/tab";
import { type Node, ReactFlowProvider } from "reactflow";
import { type Microservice } from "../../../model/microservices/models";
import { ProjectToolbar } from "./project-toolbar";
import { TypesContextProvider } from "../../../model/class/TypesContext";
import { MicroserviceContextProvider } from "../../../model/microservices/MicroserviceContext";
import { MicroserviceNodeContextProvider } from "../../../model/microservices/MicroserviceNodeContext";
import { MicroserviceDiagramWrapper } from "./wrappers/MicroserviceDiagramWrapper";
import { ClassDiagramWrapper } from "./wrappers/ClassDiagramWrapper";
import { ServiceDiagramWrapper } from "./wrappers/ServiceDiagramWrapper";

import "../../../model/common/styles/validation_styles.css";

export const Project: FC = () => {
  const { isOpened, projectDefinition: initialProjectDefinition } = useProjectContext();

  const [tabs, setTabs] = useState<TabProps[]>([]);

  const findMicroserviceName = useCallback(
    (microserviceId: string): string => {
      const microserviceNodes = initialProjectDefinition?.microservices?.nodes ?? [];
      const microserviceNode = microserviceNodes.find(
        (node: Node<Microservice>) => node.id === microserviceId
      );

      return microserviceNode?.data?.name ?? "";
    },
    [initialProjectDefinition]
  );

  const addTab = useCallback(
    (tab: TabProps) => {
      const tabAlreadyOpened = tabs.find((openedTab) => openedTab.title === tab.title);
      if (tabAlreadyOpened) return;

      setTabs([...tabs, tab]);
    },
    [tabs, setTabs]
  );

  const addServiceDiagram = useCallback(
    (microserviceId: string) => {
      const microserviceName = findMicroserviceName(microserviceId);
      if (!microserviceName) return;

      const tab = {
        title: `${microserviceName} - Services`,
        children: <ServiceDiagramWrapper microserviceId={microserviceId} />,
      };
      addTab(tab);
    },
    [findMicroserviceName, addTab]
  );

  const addModelDiagram = useCallback(
    (microserviceId: string) => {
      const microserviceName = findMicroserviceName(microserviceId);
      if (!microserviceName) return;

      const tab = {
        title: `${microserviceName} - Models`,
        children: <ClassDiagramWrapper microserviceId={microserviceId} />,
      };
      addTab(tab);
    },
    [findMicroserviceName, addTab]
  );

  if (!isOpened) {
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
