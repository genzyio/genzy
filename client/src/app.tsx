import { useCallback, useEffect, useState } from "react";
import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { ProjectsList } from "./features/projects/components/projects-list/projects-list";
import { Project } from "./features/projects/components/project-workspace/project";
import { CreateProjectForm } from "./features/projects/components/create/create-project-form";
import { RecentlyOpenedList } from "./features/projects/components/recently-opened/recently-opened-list";
import { useProjectContext } from "./features/projects/contexts/project.context";
import { ImportProjectForm } from "./features/projects/components/import/import-project-form";

export function App() {
  const { isOpened, loadProject } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = useCallback(() => setIsModalOpen((open) => !open), [setIsModalOpen]);

  const onCreatedProject = (projectName: string) => {
    toggleModal();
    loadProject(projectName);
  };

  useEffect(() => {
    if (isOpened) return;
    toggleModal();
  }, [isOpened]);

  return (
    <>
      <div className="h-full w-full">
        {!isOpened && <div className="mt-2 text-2xl text-center">Above and GN1mblyeyond!</div>}
        <>
          <Modal title="Projects" isLarge={true} isOpen={isModalOpen} onClose={() => {}}>
            <Tabs>
              <Tab className="mt-4" title="Recently Opened">
                <RecentlyOpenedList />
              </Tab>
              <Tab className="mt-4" title="All Projects">
                <ProjectsList />
              </Tab>
              <Tab className="mt-4" title="Create Project">
                <CreateProjectForm
                  onSaved={onCreatedProject}
                  onCancel={() => console.log("MOVE TO OPEN PROJECTS")}
                />
              </Tab>
              <Tab className="mt-4" title="Import Project">
                <ImportProjectForm
                  onSaved={onCreatedProject}
                  onCancel={() => console.log("MOVE TO OPEN PROJECTS")}
                />
              </Tab>
            </Tabs>
          </Modal>
        </>
        <div className="w-full h-[90%]">
          <Project />
        </div>
      </div>
    </>
  );
}
