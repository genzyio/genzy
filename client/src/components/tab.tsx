import { type FC, type PropsWithChildren } from "react";

export type TabProps = PropsWithChildren & {
  title: string;
  icon?: React.ReactElement;
  onChange?: (params: { title: string; index: number }) => void;
  onClose?: (params: { title: string; index: number }) => void;
};

export const Tab: FC<TabProps> = ({
  title,
  icon = undefined,
  onChange = undefined,
  onClose = undefined,
  children,
}) => {
  return children;
};
