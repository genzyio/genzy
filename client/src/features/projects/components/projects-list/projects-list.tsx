import { type FC } from "react";
import { useProjects } from "../../hooks/useProjects";
import { ProjectListItem } from "./project-list-item";
import { useProjectContext } from "../../contexts/project.context";
import { modifyRecentlyOpened } from "../../api/recently-opened.actions";
import { useAction } from "../../../../hooks/useAction";

export const ProjectsList: FC = () => {
  const { projects } = useProjects();
  const { loadProject } = useProjectContext();

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
              loadProject(project.name);
              modifyRecentlyOpenedAction(project.name);
            }}
          />
        ))}
      </ul>
    </>
  );
};
