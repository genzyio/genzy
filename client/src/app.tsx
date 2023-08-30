import { useCallback, useState } from "react";
import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { ProjectsList } from "./features/projects/components/projects-list/projects-list";
import { Project } from "./features/projects/components/project-workspace/project";
import { CreateProjectForm } from "./features/projects/components/create/create-project-form";
import { RecentlyOpenedList } from "./features/projects/components/recently-opened/recently-opened-list";
import { useProjectContext } from "./features/projects/contexts/project.context";

export function App() {
  const [openProject, setOpenProject] = useState(false);
  const [createProject, setCreateProject] = useState(false);

  const toggleOpenProject = useCallback(() => setOpenProject((open) => !open), [setOpenProject]);
  const toggleCreateProject = useCallback(
    () => setCreateProject((open) => !open),
    [setCreateProject]
  );

  const { loadProject } = useProjectContext();

  const onCreatedProject = (projectName: string) => {
    toggleCreateProject();
    loadProject(projectName);
  };

  return (
    <>
      <div className="h-full w-full">
        Above and GN1mblyeyond!
        <>
          <Modal title="Create Project" isOpen={createProject} onClose={toggleCreateProject}>
            <CreateProjectForm onSaved={onCreatedProject} onClosed={toggleCreateProject} />
          </Modal>

          <Modal
            title="Open Project"
            isLarge={true}
            isOpen={openProject}
            onClose={toggleOpenProject}
          >
            <Tabs>
              <Tab title="Recently Opened">
                <RecentlyOpenedList />
              </Tab>
              <Tab title="All Projects">
                <ProjectsList />
              </Tab>
            </Tabs>
          </Modal>

          <div className="flex gap-x-2">
            <p onClick={toggleCreateProject}>Create Project</p>
            <p onClick={toggleOpenProject}>Open Project</p>
          </div>
        </>
        <Project />
      </div>
    </>
  );
}
