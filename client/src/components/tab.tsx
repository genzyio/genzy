import { type FC, type PropsWithChildren } from "react";

export type TabProps = PropsWithChildren & {
  title: string;
  icon?: React.ReactElement;
};

export const Tab: FC<TabProps> = ({ title, icon = undefined, children }) => {
  return children;
};
