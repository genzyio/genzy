import { type FC, useEffect, useState } from "react";
import { Tabs, type TabsInstance } from "@core/components/tabs";
import { SearchPlugins } from "./search-plugins";
import { InstalledPlugins } from "./installed-plugins";
import { SpecificPlugin } from "./specific-plugin";
import { Button } from "@core/components/button";
import { useParams } from "react-router-dom";
import { usePluginsNavigation } from "../hooks/usePluginsNavigation";
import { usePlugin } from "../hooks/usePlugin";
import { Loader } from "@core/components/loader";

export const SpecificPluginPage: FC = () => {
  const { closeSpecificPlugin } = usePluginsNavigation();

  const { pluginName } = useParams();
  const { plugin, isFetching } = usePlugin(pluginName);

  if (!pluginName) {
    return <></>;
  }

  if (isFetching) {
    return (
      <div className="mt-[70px]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <SpecificPlugin plugin={plugin} />

      <div className="w-full flex justify-end">
        <Button type="button" onClick={closeSpecificPlugin}>
          Close
        </Button>
      </div>
    </>
  );
};

type PluginTabsProps = {
  initialTab: string;
};

export const PluginTabsPage: FC<PluginTabsProps> = ({ initialTab }) => {
  const { openSearchPlugins, openInstalledPlugins } = usePluginsNavigation();
  const [tabsInstance, setTabsInstance] = useState<TabsInstance | null>(null);

  useEffect(() => {
    const nextActiveTab = initialTab === "installed" ? 1 : 0;
    if (!tabsInstance || tabsInstance.activeTab === nextActiveTab) return;

    tabsInstance.setActiveTab(nextActiveTab);
  }, [tabsInstance]);

  return (
    <Tabs.Containter onInit={setTabsInstance}>
      <Tabs.Tab title="Search" onChange={openSearchPlugins}>
        <SearchPlugins />
      </Tabs.Tab>

      <Tabs.Tab title="Installed" onChange={openInstalledPlugins}>
        <InstalledPlugins />
      </Tabs.Tab>
    </Tabs.Containter>
  );
};
