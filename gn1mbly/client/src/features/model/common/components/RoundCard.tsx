import { type FC, type PropsWithChildren } from "react";

type RoundCardProps = PropsWithChildren & {
  className?: string;
};

export const RoundCard: FC<RoundCardProps> = ({ children, className }) => {
  const mainContent = (
    <div className="border border-gray-200 rounded-lg shadow-sm p-2">{children}</div>
  );

  if (className) {
    return <div className={className}>{mainContent}</div>;
  }

  return mainContent;
};
