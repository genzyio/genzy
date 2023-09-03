import { useMemo, type FC } from "react";
import { useRecentlyOpenedProjects } from "../../hooks/useRecenltyOpenedProjects";
import { RecentlyOpenedListItem } from "./recenlty-opened-list-item";
import { useAction } from "../../../../hooks/useAction";
import { modifyRecentlyOpened } from "../../api/recently-opened.actions";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";
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
              openProject(project.name);
              modifyRecentlyOpenedAction(project.name);
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
            (project: RecentlyOpenedProject) => !!project.openedAt
          )}
        </>
      )}

      {hasOtherProjects && (
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
