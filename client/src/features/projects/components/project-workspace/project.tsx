import { type FC, useState, useCallback, useEffect } from "react";
import { useProjectContext } from "../../contexts/project.context";
import { useProjectDefinitionContext } from "../../contexts/project-definition.context";
import { EmptyDiagram } from "../../../model/EmptyDiagram";
import { Tabs, type TabsInstance } from "../../../../components/tabs";
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
import { useSearchParams } from "react-router-dom";

import "../../../model/common/styles/validation_styles.css";

const useTabPreferences = (projectName: string) => {
  const localStorageKey = `${projectName}/tabs`;

  return {
    get: (): string[] => JSON.parse(localStorage.getItem(localStorageKey) || "[]"),
    store: (tabs: TabProps[]): void =>
      localStorage.setItem(localStorageKey, JSON.stringify(tabs.map((tab) => tab.id))),
  };
};

export const Project: FC = () => {
  const { isOpened, project } = useProjectContext();
  const { projectDefinition: initialProjectDefinition } = useProjectDefinitionContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tabsInstance, setTabsInstance] = useState<TabsInstance | null>(null);
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const tabPreferences = useTabPreferences(project.name);

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
    (tab: TabProps, inFocus: boolean = true) => {
      setTabs((tabs) => {
        const existingTabIndex = tabs.findIndex((openedTab) => openedTab.id === tab.id);
        if (existingTabIndex >= 0) {
          tabsInstance?.setActiveTab(existingTabIndex + 1);
          return tabs;
        }

        const newTabs = [...tabs, tab];
        inFocus && tabsInstance?.setActiveTab(newTabs.length);
        return newTabs;
      });
    },
    [tabsInstance, tabs, setTabs]
  );

  const addServiceDiagram = useCallback(
    (microserviceId: string, inFocus: boolean = true) => {
      const microserviceName = findMicroserviceName(microserviceId);
      if (!microserviceName) return;

      const tab = {
        id: `${microserviceId}/services`,
        title: `${microserviceName} - Services`,
        children: <ServiceDiagramWrapper microserviceId={microserviceId} />,
      };
      addTab(tab, inFocus);
    },
    [findMicroserviceName, addTab]
  );

  const addModelDiagram = useCallback(
    (microserviceId: string, inFocus: boolean = true) => {
      const microserviceName = findMicroserviceName(microserviceId);
      if (!microserviceName) return;

      const tab = {
        id: `${microserviceId}/models`,
        title: `${microserviceName} - Models`,
        children: <ClassDiagramWrapper microserviceId={microserviceId} />,
      };
      addTab(tab, inFocus);
    },
    [findMicroserviceName, addTab]
  );

  const removeTabsForMicroservice = useCallback(
    (microserviceId: string) => {
      const newTabs = tabs.filter((tab) => !tab.id.startsWith(`${microserviceId}/`));
      setTabs(newTabs);
    },
    [tabs, setTabs]
  );

  useEffect(() => {
    if (!tabsInstance) return;
    const activeTab = searchParams.get("activeTab");
    const initialTabs = activeTab ? [...tabPreferences.get(), activeTab] : tabPreferences.get();

    initialTabs.forEach((initialTab: string) => {
      if (!initialTab || !initialTab.includes("/")) return;

      const [microserviceId, type] = initialTab.split("/");
      if (type === "services") addServiceDiagram(microserviceId, false);
      if (type === "models") addModelDiagram(microserviceId, false);
    });

    const activeTabIndex = initialTabs.findIndex((tab) => tab === activeTab);
    tabsInstance?.setActiveTab(activeTabIndex + 1);
  }, [tabsInstance]);

  useEffect(() => {
    if (!tabsInstance) return;
    tabPreferences.store(tabs);
  }, [tabs]);

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

              <Tabs
                onInit={setTabsInstance}
                invert={true}
                navigationContainerClassName="border-b border-gray-100"
              >
                <Tab title="Microservices" onChange={() => setSearchParams({})}>
                  <MicroserviceDiagramWrapper onMicroserviceDeleted={removeTabsForMicroservice} />
                </Tab>

                {tabs.map((t) => {
                  return (
                    <Tab
                      id={t.id}
                      key={t.title}
                      title={t.title}
                      onChange={({ id }) => setSearchParams({ activeTab: id })}
                      onClose={({ id }) => setTabs((tabs) => tabs.filter((tab) => tab.id !== id))}
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
