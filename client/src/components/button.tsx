import { type FC, type MouseEvent } from "react";

type ButtonProps = {
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
      className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 ${
        className.includes("text-") ? "" : "text-lg"
      } font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
};
