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
      className={`${className} ${paddings} inline-flex justify-center rounded-md bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      {children}
    </button>
  );
};
