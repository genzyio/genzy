import { type FC } from "react";
import { type RecentlyOpenedProject } from "../../models/recently-opened.models";
import { getProjectScreenshotUrl } from "../../api/project-screenshots.actions";
import {
  type DropDownMenuProps,
  DropDownMenu,
  DropdownItemHandler,
} from "../../../../core/components/dropdown";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import moment = require("moment");

export type RecentlyOpenedListItemOption = {
  label: string | React.ReactElement;
  onClick: () => any;
};

type RecentlyOpenedListItemProps = {
  recentlyOpenedProject: RecentlyOpenedProject;
  onViewProject: () => any;
  options?: RecentlyOpenedListItemOption[];
  optionDirection?: DropDownMenuProps["direction"];
};

export const RecentlyOpenedListItem: FC<RecentlyOpenedListItemProps> = ({
  recentlyOpenedProject,
  onViewProject,
  options = [],
  optionDirection = undefined,
}) => {
  return (
    <li key={recentlyOpenedProject.path}>
      <div className="flex justify-between gap-x-6 py-3 hover:bg-gray-800 rounded-lg p-1">
        <div className="flex min-w-0 gap-x-4">
          <a href={getProjectScreenshotUrl(recentlyOpenedProject.name)} target="_blank">
            <img
              className="h-18 w-18 flex-none rounded-full bg-gray-50 border border-black-100"
              src={getProjectScreenshotUrl(recentlyOpenedProject.name)}
              alt=""
            />
          </a>
          <div className="min-w-0 flex-auto">
            <p
              className="text-sm font-semibold leading-6 text-gray-300 cursor-pointer hover:underline"
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
        {options && options.length ? (
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end justify-center mr-2">
            <div>
              <DropDownMenu icon={EllipsisVerticalIcon} direction={optionDirection}>
                {options.map((option, i) => (
                  <DropdownItemHandler key={i} onClick={option.onClick}>
                    {option.label}
                  </DropdownItemHandler>
                ))}
              </DropDownMenu>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </li>
  );
};
