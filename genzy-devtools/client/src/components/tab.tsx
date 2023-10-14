import { type FC, type PropsWithChildren } from "react";

export type TabProps = PropsWithChildren & {
  id?: string;
  title: string;
  className?: string;
  icon?: React.ReactElement;
  onChange?: (params: { id: string; index: number }) => void;
  onClose?: (params: { id: string; index: number }) => void;
};

export const Tab: FC<TabProps> = ({
  id = undefined,
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
