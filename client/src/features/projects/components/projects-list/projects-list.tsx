import { type FC } from "react";
import { useProjects } from "../../hooks/useProjects";
import { ProjectListItem } from "./project-list-item";
import { modifyRecentlyOpened } from "../../api/recently-opened.actions";
import { useAction } from "../../../../hooks/useAction";
import { useProjectNavigation } from "../../hooks/useProjectNavigation";

export const ProjectsList: FC = () => {
  const { projects } = useProjects();
  const { openProject } = useProjectNavigation();

  const modifyRecentlyOpenedAction = useAction<string>(modifyRecentlyOpened, {
    onSuccess: () => {},
    onError: (error) => {},
  });

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => (
          <ProjectListItem
            key={project.path}
            project={project}
            onViewProject={() => {
              openProject(project.name);
              modifyRecentlyOpenedAction(project.name);
            }}
          />
        ))}
      </ul>
    </>
  );
};
