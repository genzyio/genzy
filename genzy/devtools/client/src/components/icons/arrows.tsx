import { type FC } from "react";

type ArrowDownProps = {
  className?: string;
};

export const ArrowDown: FC<ArrowDownProps> = ({ className = "w-3 h-3 shrink-0" }) => {
  return (
    <svg
      data-accordion-icon
      className={`rotate-180 ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5 5 1 1 5"
      />
    </svg>
  );
};

type ArrowUpProps = {
  className?: string;
};

export const ArrowUp: FC<ArrowUpProps> = ({ className = "w-3 h-3 shrink-0" }) => {
  return (
    <svg
      data-accordion-icon
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5 5 1 1 5"
      />
    </svg>
  );
};
