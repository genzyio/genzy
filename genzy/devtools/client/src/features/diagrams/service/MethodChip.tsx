import { type FC } from "react";
import { type HTTPMethod } from "./models";
import { classNames } from "@core/utils/classNames";

const colors = {
  GET: "bg-blue-400",
  POST: "bg-green-400",
  PUT: "bg-orange-400",
  DELETE: "bg-red-400",
} as const;

export const MethodChip: FC<{ method: HTTPMethod; className?: string; small?: boolean }> = ({
  method,
  className = undefined,
  small = false,
}) => {
  return (
    <span
      className={classNames(
        `${colors[method]} rounded-md p-1 text-white font-bold`,
        `${small ? "text-xs" : "text-base"} text-center block`,
        className
      )}
    >
      {method}
    </span>
  );
};
