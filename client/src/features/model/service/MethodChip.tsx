import { type FC } from "react";
import { type HTTPMethod } from "./models";

const colors = {
  GET: "bg-blue-400",
  POST: "bg-green-400",
  PUT: "bg-orange-400",
  DELETE: "bg-red-400",
} as const;

export const MethodChip: FC<{ method: HTTPMethod; small?: boolean }> = ({
  method,
  small = false,
}) => {
  return (
    <span
      className={`${colors[method]} rounded-md p-1 text-white font-bold ${
        small ? "text-xs" : "text-base"
      } text-center block`}
    >
      {method}
    </span>
  );
};
