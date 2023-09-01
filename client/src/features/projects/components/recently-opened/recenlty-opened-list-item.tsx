import { type FC } from "react";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";
import { getProjectScreenshotUrl } from "../../api/project-screenshots.actions";
import moment = require("moment");
import { Button } from "../../../../components/button";

type RecentlyOpenedListItemProps = {
  recentlyOpenedProject: RecentlyOpenedProject;
  onViewProject: () => any;
};

export const RecentlyOpenedListItem: FC<RecentlyOpenedListItemProps> = ({
  recentlyOpenedProject,
  onViewProject,
}) => {
  return (
    <li
      key={recentlyOpenedProject.path}
      className="flex justify-between gap-x-6 py-5 hover:bg-gray-100 rounded-lg p-1"
    >
      <div className="flex min-w-0 gap-x-4">
        <img
          className="h-14 w-14 flex-none rounded-full bg-gray-50 border border-black-100"
          src={getProjectScreenshotUrl(recentlyOpenedProject.name)}
          alt=""
        />
        <div className="min-w-0 flex-auto">
          <p
            className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
            onClick={onViewProject}
          >
            {recentlyOpenedProject.name}
          </p>
          {!!recentlyOpenedProject.openedAt ? (
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
              Opened: {moment(recentlyOpenedProject.openedAt).fromNow()}
            </p>
          ) : (
            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
              Created: {moment(recentlyOpenedProject.createdAt).fromNow()}
            </p>
          )}
        </div>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <Button onClick={onViewProject}>View Project</Button>
      </div>
    </li>
  );
};
