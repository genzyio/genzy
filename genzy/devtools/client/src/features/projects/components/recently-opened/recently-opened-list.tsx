import { useMemo, type FC, useState } from "react";
import { useRecentlyOpenedProjects } from "../../hooks/useRecenltyOpenedProjects";
import {
  RecentlyOpenedListItem,
  type RecentlyOpenedListItemOption,
} from "./recently-opened-list-item";
import { useAction } from "../../../../core/hooks/useAction";
import { deleteRecentlyOpened } from "../../api/recently-opened.actions";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";
import { Checkbox } from "../../../../core/components/checkbox";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { deleteProject } from "../../api/project.actions";
import { useQueryClient } from "react-query";
import { ConfirmationModal } from "../../../../core/components/confirmation-modal";
import { useProjectNavigation } from "../../hooks/useProjectNavigation";
import { BookmarkSlashIcon, ClipboardDocumentIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Accordion } from "../../../../core/components/accordion";

export const RecentlyOpenedList: FC = () => {
  const { recentlyOpenedProjects } = useRecentlyOpenedProjects();
  const { openProject } = useProjectNavigation();

  const hasRecentProjects = useMemo(() => {
    return recentlyOpenedProjects.some((project) => !!project.openedAt);
  }, [recentlyOpenedProjects]);

  const hasOtherProjects = useMemo(() => {
    return recentlyOpenedProjects.some((project) => !project.openedAt);
  }, [recentlyOpenedProjects]);

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
    optionsFactory: (project: RecentlyOpenedProject) => RecentlyOpenedListItemOption[]
  ) {
    return (
      <ul role="list" className="divide-y divide-gray-500">
        {projects.filter(filterCondition).map((project, i, projects) => (
          <RecentlyOpenedListItem
            key={project.name}
            recentlyOpenedProject={project}
            onViewProject={() => {
              openProject(project.name);
            }}
            options={optionsFactory(project)}
            optionDirection={projects.length === i + 1 ? "top" : "bottom"}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className="mt-10">
      {hasRecentProjects && (
        <Accordion title="Recently opened" titleClassName="font-bold" initiallyOpen={true}>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !!project.openedAt,
            (project: RecentlyOpenedProject) => [
              {
                label: <OptionLabel title="Copy path" icon={ClipboardDocumentIcon} />,
                onClick: () => navigator.clipboard.writeText(project.path),
              },
              {
                label: <OptionLabel title="Remove from list" icon={BookmarkSlashIcon} />,
                onClick: () => deleteRecentlyOpenedAction(project.name),
              },
              {
                label: <OptionLabel title="Delete" icon={TrashIcon} />,
                onClick: () => openDeleteModal(project),
              },
            ]
          )}
        </Accordion>
      )}

      {hasOtherProjects && (
        <Accordion className="mt-5" title="Other" titleClassName="font-bold" initiallyOpen={true}>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !project.openedAt,
            (project: RecentlyOpenedProject) => [
              {
                label: <OptionLabel title="Copy path" icon={ClipboardDocumentIcon} />,
                onClick: () => navigator.clipboard.writeText(project.path),
              },
              {
                label: <OptionLabel title="Delete" icon={TrashIcon} />,
                onClick: () => openDeleteModal(project),
              },
            ]
          )}
        </Accordion>
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
          <p className="font-medium leading-6 mb-5">
            Are you sure you want to remove project "{selectedProject.name}" from workspace?
          </p>
          <Checkbox
            label="Remove project contents from file system."
            checked={isFromFileChecked}
            onChange={(isChecked) => setFromFileChecked(isChecked)}
          />
        </ConfirmationModal>
      )}
    </div>
  );
};

type OptionLabelProps = {
  title: string;
  icon: React.ElementType;
};

const OptionLabel: FC<OptionLabelProps> = ({ icon: Icon, title }) => {
  return (
    <span className="flex space-x-1 items-center">
      <Icon className="-ml-2 h-4 w-4" />
      <span>{title}</span>
    </span>
  );
};
