import { useMemo, type FC, type MouseEvent } from "react";

export type ButtonProps = {
  type?: "submit" | "button";
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => any;
  children: React.ReactNode;
};

export const Button: FC<ButtonProps> = ({
  type = "submit",
  className = "",
  disabled = false,
  onClick = () => {},
  children,
}) => {
  const paddings = useMemo(
    () => `
    ${!className.includes("px-") ? "px-1" : ""} 
    ${!className.includes("py-") ? "py-1" : ""}
  `,
    [className]
  );

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${paddings} inline-flex justify-center rounded-md text-gray-300 border border-gray-600 bg-brand-node-gray font-medium shadow-sm hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-brand-node-gray focus:ring-offset-2 ${
        disabled ? "opacity-75" : ""
      } select-none`}
    >
      {children}
    </button>
  );
};
