import { type FC, type PropsWithChildren } from "react";

export type TabProps = PropsWithChildren & {
  title: string;
  className?: string;
  icon?: React.ReactElement;
  onChange?: (params: { title: string; index: number }) => void;
  onClose?: (params: { title: string; index: number }) => void;
};

export const Tab: FC<TabProps> = ({
  title,
  className = undefined,
  icon = undefined,
  onChange = undefined,
  onClose = undefined,
  children,
}) => {
  if (!className) return children;

  return <div className={className}>{children}</div>;
};
