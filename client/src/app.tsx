import { useCallback, useState } from "react";
import Diagram from "./features/model/Diagram";
import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => setIsOpen((open) => !open), [setIsOpen]);

  return (
    <div className="h-full w-full">
      Above and GN1mblyeyond!
      <>
        <Modal title="Test Modal" isOpen={isOpen} onClose={toggleIsOpen}>
          Modal Body
        </Modal>
        <p onClick={toggleIsOpen}>Test Modal</p>
      </>
      <Tabs>
        <Tab title="Recently Opened">Recently Opened</Tab>
        <Tab title="All Projects">All Projects</Tab>
      </Tabs>
      <Diagram />
    </div>
  );
}
