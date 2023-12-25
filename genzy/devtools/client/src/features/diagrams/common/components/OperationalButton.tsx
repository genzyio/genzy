import { useMemo, type FC } from "react";
import { type ButtonProps } from "../../../../core/components/button";

type OperationalButtonProps = Pick<ButtonProps, "onClick" | "children"> & {
  color?: string;
  borderColor?: string;
  border?: "left" | "both" | "right";
};

const OperationalButton: FC<OperationalButtonProps> = ({
  onClick,
  color = "indigo-700",
  borderColor = "",
  border = "both",
  children,
}) => {
  const roundedClass = useMemo(() => {
    if (border === "left") return "rounded-l-lg";
    if (border === "right") return "rounded-r-lg";
    return "rounded-lg";
  }, [border]);

  return (
    <button
      type="button"
      className={
        `text-${color} text-center text-xs ` +
        `border border-${borderColor || color} ${roundedClass} w-14 px-2 py-1.5`
      }
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      {children}
    </button>
  );
};

export { OperationalButton };
