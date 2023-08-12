import { useCallback, useState } from "react";
import Diagram from "./features/model/Diagram";
import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { ProjectsList } from "./features/projects/projects-list/projects-list";
import { saveProjectScreenshot } from "./features/projects/project-screenshots";

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => setIsOpen((open) => !open), [setIsOpen]);

  const onSaveScreenshot = saveProjectScreenshot;

  return (
    <>
      <div className="h-full w-full">
        Above and GN1mblyeyond!
        <>
          <Modal title="Test Modal" isOpen={isOpen} onClose={toggleIsOpen}>
            Modal Body
          </Modal>

          <p onClick={toggleIsOpen}>Test Modal</p>

          <p onClick={onSaveScreenshot}>Save Screenshot</p>
        </>
        <Tabs>
          <Tab title="Recently Opened">Recently Opened</Tab>
          <Tab title="All Projects">
            <ProjectsList />
          </Tab>
        </Tabs>
        <Diagram />
      </div>
    </>
  );
}
