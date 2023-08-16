import { type FC } from "react";
import { useRecentlyOpenedProjects } from "../../hooks/useRecenltyOpenedProjects";
import { useProjectContext } from "../../contexts/project.context";
import { RecentlyOpenedListItem } from "./recenlty-opened-list-item";
import { useAction } from "../../../../hooks/useAction";
import { modifyRecentlyOpened } from "../../api/recently-opened.actions";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";

export const RecentlyOpenedList: FC = () => {
  const { recentlyOpenedProjects } = useRecentlyOpenedProjects();
  const { loadProject } = useProjectContext();

  const modifyRecentlyOpenedAction = useAction<string>(modifyRecentlyOpened, {
    onSuccess: () => {},
    onError: (error) => {},
  });

  function renderProjectList(
    projects: RecentlyOpenedProject[],
    filterCondition: (project: RecentlyOpenedProject) => boolean
  ) {
    return (
      <ul role="list" className="divide-y divide-gray-100">
        {projects.filter(filterCondition).map((project) => (
          <RecentlyOpenedListItem
            key={project.name}
            recentlyOpenedProject={project}
            onViewProject={() => {
              loadProject(project.name);
              modifyRecentlyOpenedAction(project.name);
            }}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      {recentlyOpenedProjects.length > 0 && (
        <>
          <p className="font-bold">Recently opened</p>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !!project.openedAt
          )}
        </>
      )}

      {recentlyOpenedProjects.some((project) => !project.openedAt) && (
        <>
          <p className="font-bold">Other</p>
          {renderProjectList(
            recentlyOpenedProjects,
            (project: RecentlyOpenedProject) => !project.openedAt
          )}
        </>
      )}
    </>
  );
};
