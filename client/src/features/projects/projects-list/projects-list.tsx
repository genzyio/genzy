import { type FC } from "react";
import { useProjects } from "../useProjects";
import { ProjectListItem } from "./project-list-item";

export const ProjectsList: FC = () => {
  const { projects } = useProjects();

  return (
    <>
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => (
          <ProjectListItem key={project.path} project={project} />
        ))}
      </ul>
    </>
  );
};
