import { type FC, useState, useCallback, useEffect } from "react";
import { useProjectContext } from "../contexts/project.context";
import { useProjectDefinitionContext } from "../contexts/project-definition.context";
import { EmptyDiagram } from "@features/diagrams/empty-diagram";
import { Tabs, type TabsInstance, type TabProps } from "@core/components/tabs";
import { type Node, ReactFlowProvider } from "reactflow";
import { type Microservice } from "@features/diagrams/microservices/models";
import { ProjectToolbar } from "./project-toolbar";
import { TypesContextProvider } from "@features/diagrams/class/types.context";
import { MicroserviceDiagramWrapper } from "./wrappers/microservices-diagram-wrapper";
import { ClassDiagramWrapper } from "./wrappers/class-diagram-wrapper";
import { ServiceDiagramWrapper } from "./wrappers/service-diagram-wrapper";
import { SwaggerWrapper } from "./wrappers/swagger-wrapper";
import { useSearchParams } from "react-router-dom";
import { MicroserviceEvents } from "@features/diagrams/microservices/microservices-diagram.events";
import { useEvent } from "@core/hooks/useEvent";

import "@features/diagrams/common/styles/validation_styles.css";

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
  const [isDocsActive, setIsDocsActive] = useState(false);
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

  const addDocs = useCallback(
    (microserviceId: string, inFocus: boolean = true) => {
      const microserviceName = findMicroserviceName(microserviceId);
      if (!microserviceName) return;

      const tab = {
        id: `${microserviceId}/docs`,
        title: `${microserviceName} - Docs`,
        children: <SwaggerWrapper microserviceId={microserviceId} />,
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
      if (type === "docs") addDocs(microserviceId, false);
    });

    const activeTabIndex = initialTabs.findIndex((tab) => tab === activeTab);
    tabsInstance?.setActiveTab(activeTabIndex + 1);
  }, [tabsInstance]);

  useEffect(() => {
    if (!tabsInstance) return;
    tabPreferences.store(tabs);
  }, [tabs]);

  useEffect(() => {
    if (!tabsInstance) return;
    const activeTab = searchParams.get("activeTab");
    if (!activeTab && tabsInstance?.activeTab !== 0) {
      tabsInstance.setActiveTab(0);
      return;
    }

    const existingTabIndex = tabs?.findIndex((tab) => tab.id === activeTab);
    if (tabsInstance?.activeTab !== existingTabIndex + 1) {
      tabsInstance.setActiveTab(existingTabIndex + 1);
    }
  }, [tabsInstance, searchParams]);

  useEvent(MicroserviceEvents.ON_SERVICES_CLICK, addServiceDiagram, [addServiceDiagram]);
  useEvent(MicroserviceEvents.ON_MODELS_CLICK, addModelDiagram, [addModelDiagram]);
  useEvent(MicroserviceEvents.ON_DOCS_CLICK, addDocs, [addDocs]);

  if (!isOpened) {
    return <EmptyDiagram />;
  }

  return (
    <>
      <ReactFlowProvider>
        <TypesContextProvider>
          {!isDocsActive && <ProjectToolbar />}

          <Tabs.Containter
            onInit={setTabsInstance}
            invert={true}
            navigationContainerClassName="border-b border-gray-100"
          >
            <Tabs.Tab
              title="Microservices"
              onChange={() => {
                setSearchParams((params) => {
                  params.delete("activeTab");
                  return params;
                });
                setIsDocsActive(false);
              }}
            >
              <MicroserviceDiagramWrapper onMicroserviceDeleted={removeTabsForMicroservice} />
            </Tabs.Tab>

            {tabs.map((tab) => {
              return (
                <Tabs.Tab
                  id={tab.id}
                  key={tab.title}
                  title={tab.title}
                  onChange={({ id }) => {
                    setSearchParams({ activeTab: id });
                    setIsDocsActive(tab.id.endsWith("/docs"));
                  }}
                  onClose={({ id }) => setTabs((tabs) => tabs.filter((tab) => tab.id !== id))}
                >
                  {tab.children}
                </Tabs.Tab>
              );
            })}
          </Tabs.Containter>
        </TypesContextProvider>
      </ReactFlowProvider>
    </>
  );
};
