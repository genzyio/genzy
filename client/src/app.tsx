import { useCallback, useState } from "react";
import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { ProjectsList } from "./features/projects/components/projects-list/projects-list";
import { Project } from "./features/projects/components/project";

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => setIsOpen((open) => !open), [setIsOpen]);

  return (
    <>
      <div className="h-full w-full">
        Above and GN1mblyeyond!
        <>
          <Modal title="Open Project" isOpen={isOpen} onClose={toggleIsOpen}>
            <Tabs>
              <Tab title="Recently Opened">Recently Opened</Tab>
              <Tab title="All Projects">
                <ProjectsList />
              </Tab>
            </Tabs>
          </Modal>

          <p onClick={toggleIsOpen}>Open Project</p>
        </>
        <Project />
      </div>
    </>
  );
}
