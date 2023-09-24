import { type FC } from "react";
import { Modal, ModalProps } from "../../../components/modal";
import { Tabs } from "../../../components/tabs";
import { Tab } from "../../../components/tab";
import { SearchPlugins } from "./search-plugins";

type PluginsModalProps = Omit<ModalProps, "title" | "children"> & { microserviceId: string };

export const PluginModal: FC<PluginsModalProps> = ({ isOpen, isLarge, onClose }) => {
  return (
    <>
      <Modal title="Plugins" isOpen={isOpen} isLarge={isLarge} onClose={onClose}>
        <Tabs>
          <Tab title="Installed">
            <SearchPlugins />
          </Tab>

          <Tab title="Search">
            <SearchPlugins />
          </Tab>
        </Tabs>
      </Modal>
    </>
  );
};
