import { type FC, type MouseEvent } from "react";

export type ButtonProps = {
  type?: "submit" | "button";
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => any;
  children: React.ReactNode;
  className?: string;
};

export const Button: FC<ButtonProps> = ({
  type = "submit",
  onClick = () => {},
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} inline-flex justify-center rounded-md bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      {children}
    </button>
  );
};
