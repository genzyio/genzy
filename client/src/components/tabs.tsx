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
};

export const Tabs: FC<TabsProps> = ({ onInit, children }) => {
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

  const tabsInstance: TabsInstance = {} as TabsInstance;
  useEffect(() => {
    tabsInstance.activeTab = activeTab;
    tabsInstance.setActiveTab = setNextActiveTab;
    tabsInstance.tabsCount = tabs.length;
  }, [activeTab, setNextActiveTab, tabs]);

  useEffect(() => {
    if (nextActiveTab === -1) return;

    const nextTab = tabs[nextActiveTab].props;
    onTabChange(nextTab, nextActiveTab);

    setNextActiveTab(-1);
  }, [nextActiveTab]);

  return (
    <>
      <div
        key={`navigation_${tabs?.length}`}
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {tabs?.map((tab: { props: TabProps }, i: number) => {
            return (
              <li
                key={tab.props.id || tab.props.title}
                className="mr-2"
                onClick={() => onTabChange(tab.props, i)}
              >
                <p
                  className={
                    i === activeTab
                      ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group cursor-pointer"
                      : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group cursor-pointer"
                  }
                >
                  {tab.props.icon || <></>}
                  {tab.props.title}
                  {tab.props.onClose && (
                    <span
                      className="ml-1 self-start hover:text-gray-900 dark:hover:text-gray-900"
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

      <div key={`view_${activeTab}`} className="h-full w-full" role="tabpanel">
        {tabs[activeTab]}
      </div>
    </>
  );
};
