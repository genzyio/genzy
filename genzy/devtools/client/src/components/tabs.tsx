import { type TabProps } from "./tab";
import { type FC, type PropsWithChildren, useMemo, useState, useEffect } from "react";
import { XMark } from "./icons/x-mark";
import { flatten } from "../utils/object";

export type TabsInstance = {
  activeTab: number;
  tabsCount: number;
  setActiveTab: (tab: number) => any;
};

type TabsProps = PropsWithChildren & {
  onInit?: (tabsInstance: TabsInstance) => any;
  invert?: boolean;
  navigationContainerClassName?: string;
  contentContainerClassName?: string;
};

export const Tabs: FC<TabsProps> = ({
  onInit,
  invert = false,
  navigationContainerClassName = "",
  contentContainerClassName = "",
  children,
}) => {
  const [tabsInstance] = useState<TabsInstance>({} as TabsInstance);
  const [activeTab, setActiveTab] = useState(0);
  const [nextActiveTab, setNextActiveTab] = useState(-1);

  const tabs = useMemo(
    () =>
      flatten(children as any[]).filter((child: any) => {
        return child.type.name === "Tab";
      }),
    [children]
  );

  const onTabChange = ({ id, onChange }: TabProps, index: number) => {
    setActiveTab(index);
    onChange && onChange({ id, index });
  };

  const onTabClose = ({ onClose, id }: TabProps, index: number) => {
    if (activeTab >= index) setNextActiveTab(activeTab - 1);
    onClose({ id, index });
  };

  useEffect(() => {
    onInit && onInit(tabsInstance);
  }, []);

  useEffect(() => {
    tabsInstance.activeTab = activeTab;
    tabsInstance.setActiveTab = setNextActiveTab;
    tabsInstance.tabsCount = tabs.length;
  }, [activeTab, setNextActiveTab, tabs]);

  useEffect(() => {
    if (nextActiveTab === -1) return;

    const nextTab = tabs[nextActiveTab]?.props;
    if (nextTab) {
      onTabChange(nextTab, nextActiveTab);
    }
    setNextActiveTab(-1);
  }, [nextActiveTab]);

  const navigation = (
    <div key={`navigation_${tabs?.length}`} className={navigationContainerClassName}>
      <ul className="flex flex-wrap gap-x-1 -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {tabs?.map((tab: { props: TabProps }, i: number) => {
          return (
            <li key={tab.props.id || tab.props.title} onClick={() => onTabChange(tab.props, i)}>
              <p
                className={`inline-flex items-center justify-center px-2 py-2 group cursor-pointer rounded-t-lg ${
                  i === activeTab
                    ? "text-blue-600 border-b-2 border-blue-600 active dark:text-blue-500 dark:border-blue-500"
                    : "border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                }`}
              >
                {tab.props.icon || <></>}
                {tab.props.title}
                {tab.props.onClose && (
                  <span
                    className="px-2 hover:text-gray-900 dark:hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.props, i);
                    }}
                  >
                    <XMark />
                  </span>
                )}
              </p>
            </li>
          );
        }) ?? []}
      </ul>
    </div>
  );

  const content = (
    <div
      key={`view_${activeTab}`}
      className={contentContainerClassName + " h-full w-full"}
      role="tabpanel"
    >
      {tabs[activeTab]}
    </div>
  );

  return (
    <div className={`h-full w-full flex flex-col ${invert ? "flex-col-reverse" : ""}`}>
      <div className="w-full">{navigation}</div>
      <div className="grow">{content}</div>
    </div>
  );
};
