import { type FC, type PropsWithChildren } from "react";
import { ArrowDown } from "../../../../components/icons/arrow-down";

type ClosableWrapperProps = PropsWithChildren & {
  className?: string;
  hidden?: boolean;
  onClick: () => void;
};

export const ClosableWrapper: FC<ClosableWrapperProps> = ({
  className,
  hidden = false,
  onClick,
  children,
}) => {
  return (
    <div className={className}>
      {!hidden ? (
        <div className="absolute right-7 cursor-pointer" onClick={onClick}>
          <ArrowDown />
        </div>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};
