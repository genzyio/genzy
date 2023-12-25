import { Modal } from "@core/components/modal";
import { Tabs } from "@core/components/tabs";
import { Tab } from "@core/components/tab";
import { RecentlyOpenedList } from "./components/recently-opened/recently-opened-list";
import { CreateProjectForm } from "./components/create/create-project-form";
import { ImportProjectForm } from "./components/import/import-project-form";
import { EmptyDiagram } from "@features/diagrams/EmptyDiagram";
import { useProjectNavigation } from "./hooks/useProjectNavigation";
import { useRefresh } from "./hooks/useRefresh";

export function ProjectsModal() {
  const { openProject } = useProjectNavigation();
  const { key: createKey, refresh: createRefresh } = useRefresh("create");
  const { key: importKey, refresh: importRefresh } = useRefresh("import");

  return (
    <>
      <div className="h-full w-full">
        <EmptyDiagram />

        <Modal
          title="Projects"
          className="h-[500px] overflow-y-auto"
          isLarge={true}
          isOpen={true}
          onClose={() => {}}
        >
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
