import { type TabProps } from "./tab";
import { type FC, type PropsWithChildren, useMemo, useState } from "react";

export const Tabs: FC<PropsWithChildren> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () => children.filter((child: any) => child.type.name === "Tab"),
    [children]
  );

  return (
    <>
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {tabs?.map((tab: { props: TabProps }, i: number) => {
            return (
              <li key={tab.props.title} className="mr-2" onClick={() => setActiveTab(i)}>
                <a
                  href="#"
                  className={
                    i === activeTab
                      ? "inline-flex items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group"
                      : "inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
                  }
                >
                  {tab.props.icon || <></>}
                  {tab.props.title}
                </a>
              </li>
            );
          }) ?? []}
        </ul>
      </div>

      <div role="tabpanel">{children[activeTab]}</div>
    </>
  );
};

{
  /* <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
  Disabled
</a> */
}
