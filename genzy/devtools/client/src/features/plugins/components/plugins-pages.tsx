import { type FC, useEffect, useState } from "react";
import { Tabs, TabsInstance } from "../../../components/tabs";
import { Tab } from "../../../components/tab";
import { SearchPlugins } from "./search-plugins";
import { InstalledPlugins } from "./installed-plugins";
import { SpecificPlugin } from "./specific-plugin";
import { Button } from "../../../components/button";
import { useParams } from "react-router-dom";
import { usePluginsNavigation } from "../hooks/usePluginsNavigation";

export const SpecificPluginPage: FC = () => {
  const { pluginName } = useParams();
  const { closeSpecificPlugin } = usePluginsNavigation();

  if (!pluginName) {
    return <></>;
  }

  return (
    <>
      <SpecificPlugin pluginName={pluginName} />
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
    tabsInstance?.setActiveTab(initialTab === "installed" ? 1 : 0);
  }, [tabsInstance, initialTab]);

  return (
    <Tabs onInit={setTabsInstance}>
      <Tab title="Search" onChange={openSearchPlugins}>
        <SearchPlugins />
      </Tab>

      <Tab title="Installed" onChange={openInstalledPlugins}>
        <InstalledPlugins />
      </Tab>
    </Tabs>
  );
};
