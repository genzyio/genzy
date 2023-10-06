import { type FC, useEffect } from "react";
import { Modal, ModalProps } from "../../../components/modal";
import { Tabs } from "../../../components/tabs";
import { Tab } from "../../../components/tab";
import { SearchPlugins } from "./search-plugins";
import { useMicroserviceContext } from "../../model/microservices/MicroserviceContext";
import { InstalledPlugins } from "./installed-plugins";
import {
  PluginsModalContextProvider,
  usePluginsModalContext,
} from "../context/plugins-modal.context";
import { SpecificPlugin } from "./specific-plugin";
import { Button } from "../../../components/button";

const ModalBody: FC = () => {
  const { specificPlugin, setSpecificPlugin } = usePluginsModalContext();

  if (specificPlugin) {
    return (
      <div>
        <SpecificPlugin pluginName={specificPlugin}></SpecificPlugin>
        <div className="w-full flex justify-end">
          <Button type="button" onClick={() => setSpecificPlugin("")}>
            Close
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Tabs>
      <Tab title="Installed">
        <InstalledPlugins />
      </Tab>

      <Tab title="Search">
        <SearchPlugins />
      </Tab>
    </Tabs>
  );
};

type PluginsModalProps = Omit<ModalProps, "title" | "children"> & { microserviceId: string };

export const PluginModal: FC<PluginsModalProps> = ({
  microserviceId,
  isOpen,
  isLarge,
  onClose,
}) => {
  const { setMicroserviceId } = useMicroserviceContext();
  useEffect(() => {
    setMicroserviceId(microserviceId);
    return () => setMicroserviceId("");
  });

  return (
    <PluginsModalContextProvider close={onClose}>
      <Modal title="Plugins" isOpen={isOpen} isLarge={isLarge} onClose={onClose}>
        <ModalBody />
      </Modal>
    </PluginsModalContextProvider>
  );
};
