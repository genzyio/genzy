import { type FC } from "react";
import { type Project } from "../projects-models";
import { Button } from "../../../components/button";
import moment = require("moment");
import { getProjectScreenshotUrl } from "../project-screenshots";

type ProjectListItemProps = {
  project: Project;
};

export const ProjectListItem: FC<ProjectListItemProps> = ({ project }) => {
  return (
    <li key={project.path} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <img
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={getProjectScreenshotUrl(project)}
          alt=""
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">{project.name}</p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            Created: {moment(project.createdAt).fromNow()}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <Button>View Project</Button>
      </div>
    </li>
  );
};
