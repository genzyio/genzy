import { type FC } from "react";

type LoadingRowProps = {
  color: string;
  width?: number;
  height?: number;
};

export const LoadingRow: FC<LoadingRowProps> = ({ color, width = 30, height = 16 }) => {
  return (
    <div
      className={`border-${color} border-2 rounded bg-${color}`}
      style={{ width: `${width}%`, height: `${height}px` }}
    ></div>
  );
};
