import { Modal } from "./components/modal";
import { Tabs } from "./components/tabs";
import { Tab } from "./components/tab";
import { RecentlyOpenedList } from "./features/projects/components/recently-opened/recently-opened-list";
import { CreateProjectForm } from "./features/projects/components/create/create-project-form";
import { ImportProjectForm } from "./features/projects/components/import/import-project-form";
import { EmptyDiagram } from "./features/model/EmptyDiagram";
import { useProjectNavigation } from "./features/projects/hooks/useProjectNavigation";
import { useRefresh } from "./features/projects/hooks/useRefresh";

export function ProjectsModal() {
  const { openProject } = useProjectNavigation();
  const { key: createKey, refresh: createRefresh } = useRefresh("create");
  const { key: importKey, refresh: importRefresh } = useRefresh("import");

  return (
    <>
      <div className="h-full w-full">
        <div className="mt-2 text-2xl text-center">Above and Genzyeyond!</div>

        <EmptyDiagram />

        <Modal title="Projects" isLarge={true} isOpen={true} onClose={() => {}}>
          <Tabs>
            <Tab className="mt-4" title="All">
              <RecentlyOpenedList />
            </Tab>
            <Tab className="mt-4" title="Create">
              <CreateProjectForm key={createKey} onSaved={openProject} onCancel={createRefresh} />
            </Tab>
            <Tab className="mt-4" title="Import">
              <ImportProjectForm key={importKey} onSaved={openProject} onCancel={importRefresh} />
            </Tab>
          </Tabs>
        </Modal>
      </div>
    </>
  );
}
