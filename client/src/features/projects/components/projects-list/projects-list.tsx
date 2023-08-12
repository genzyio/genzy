import { type FC } from "react";
import { useProjects } from "../../hooks/useProjects";
import { ProjectListItem } from "./project-list-item";
import { useProjectContext } from "../../contexts/project.context";

export const ProjectsList: FC = () => {
  const { projects } = useProjects();
  const { loadProject } = useProjectContext();

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => (
          <ProjectListItem
            key={project.path}
            project={project}
            onViewProject={() => loadProject(project.name)}
          />
        ))}
      </ul>
    </>
  );
};
