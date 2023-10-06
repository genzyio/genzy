import { useMemo, type FC, useState } from "react";
import { useRecentlyOpenedProjects } from "../../hooks/useRecenltyOpenedProjects";
import { RecentlyOpenedListItem } from "./recenlty-opened-list-item";
import { useAction } from "../../../../hooks/useAction";
import { deleteRecentlyOpened, modifyRecentlyOpened } from "../../api/recently-opened.actions";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";
import { Checkbox } from "../../../../components/checkbox";
import { useNotifications } from "../../../../hooks/useNotifications";
import { extractErrorMessage } from "../../../../utils/errors";
import { deleteProject } from "../../api/project.actions";
import { useQueryClient } from "react-query";
import { ConfirmationModal } from "../../../../components/confirmation-modal";
import { useProjectNavigation } from "../../hooks/useProjectNavigation";

export const RecentlyOpenedList: FC = () => {
  const { recentlyOpenedProjects } = useRecentlyOpenedProjects();
  const { openProject } = useProjectNavigation();

  const hasRecentProjects = useMemo(() => {
    return recentlyOpenedProjects.some((project) => !!project.openedAt);
  }, [recentlyOpenedProjects]);

  const hasOtherProjects = useMemo(() => {
    return recentlyOpenedProjects.some((project) => !project.openedAt);
  }, [recentlyOpenedProjects]);

  const modifyRecentlyOpenedAction = useAction<string>(modifyRecentlyOpened, {
    onSuccess: () => {},
    onError: (error) => {},
  });

  const notificator = useNotifications();

  const [isFromFileChecked, setFromFileChecked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<RecentlyOpenedProject | null>(null);

  const queryClient = useQueryClient();

  const deleteRecentlyOpenedAction = useAction<string>(deleteRecentlyOpened, {
    onSuccess: () => {
      notificator.success("You have successfully remove project from recently opened.");
      queryClient.invalidateQueries({ queryKey: [`projects/recently-opened`] });
    },
    onError: (error) => {
      notificator.error(extractErrorMessage(error));
    },
  });

  const deleteProjectAction = useAction(
    ({ projectName, physical }: { projectName: string; physical: boolean }) =>
      deleteProject({ projectName, physical }),
    {
      onSuccess: () => {
        closeDeleteModal();
        notificator.success("You have successfully deleted project.");
        queryClient.invalidateQueries({ queryKey: [`projects/recently-opened`] });
      },
      onError: (error) => {
        notificator.error(extractErrorMessage(error));
      },
    }
  );

  const openDeleteModal = (project: RecentlyOpenedProject) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
    setFromFileChecked(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProject(null);
  };

  function renderProjectList(
    projects: RecentlyOpenedProject[],
    filterCondition: (project: RecentlyOpenedProject) => boolean,
    onRemoveProject: (project: RecentlyOpenedProject) => any
  ) {
    return (
      <ul role="list" className="divide-y divide-gray-100">
        {projects.filter(filterCondition).map((project) => (
          <RecentlyOpenedListItem
            key={project.name}
            recentlyOpenedProject={project}
            onViewProject={() => {
              openProject(project.name);
              modifyRecentlyOpenedAction(project.name);
            }}
            onRemoveProject={() => {
              onRemoveProject(project);
            }}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      {hasRecentProjects && (
        <>
          <p className="font-bold">Recently opened</p>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !!project.openedAt,
            (project: RecentlyOpenedProject) => deleteRecentlyOpenedAction(project.name)
          )}
        </>
      )}

      {hasOtherProjects && (
        <>
          <p className="font-bold mt-2">Other</p>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !project.openedAt,
            (project: RecentlyOpenedProject) => openDeleteModal(project)
          )}
        </>
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          title="Confirm"
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onYes={() =>
            deleteProjectAction({
              projectName: selectedProject.name,
              physical: isFromFileChecked,
            })
          }
        >
          <p className="text-lg font-medium text-gray-700 mb-5">
            Are you sure you want to remove project "{selectedProject.name}" from workspace?
          </p>
          <Checkbox
            label="Remove project contents from file system."
            checked={isFromFileChecked}
            onChange={(isChecked) => setFromFileChecked(isChecked)}
          />
        </ConfirmationModal>
      )}
    </>
  );
};