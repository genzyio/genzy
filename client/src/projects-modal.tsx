import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { RecentlyOpenedList } from "./features/projects/components/recently-opened/recently-opened-list";
import { CreateProjectForm } from "./features/projects/components/create/create-project-form";
import { ImportProjectForm } from "./features/projects/components/import/import-project-form";
import { ProjectsList } from "./features/projects/components/projects-list/projects-list";
import { EmptyDiagram } from "./features/model/EmptyDiagram";
import { useProjectNavigation } from "./features/projects/hooks/useProjectNavigation";

export function ProjectsModal() {
  const { openProject } = useProjectNavigation();

  const onCreatedProject = (projectName: string) => {
    openProject(projectName);
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="mt-2 text-2xl text-center">Above and GN1mblyeyond!</div>

        <EmptyDiagram />

        <Modal title="Projects" isLarge={true} isOpen={true} onClose={() => {}}>
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
      </div>
    </>
  );
}
