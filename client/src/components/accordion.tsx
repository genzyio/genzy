import { FC, PropsWithChildren } from "react";
import { ArrowDown } from "./icons/arrow-down";

type AccordionWrapperProps = PropsWithChildren & {
  id?: "";
  type?: "open" | "collapse";
};

const AccordionWrapper: FC<AccordionWrapperProps> = ({
  id = "accordion-wrapper",
  type = "collapse",
  children,
}) => {
  return (
    <div
      id={id}
      data-accordion={type}
      data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      data-inactive-classes="text-gray-500 dark:text-gray-400"
    >
      {children}
    </div>
  );
};

type AccordionProps = PropsWithChildren & {
  id: string;
  title: string;
  titleClassName?: string;
  initiallyOpen?: boolean;
};

const Accordion: FC<AccordionProps> = ({
  id,
  title,
  titleClassName = "",
  initiallyOpen = false,
  children,
}) => {
  const headingId = `${id}-heading`;
  const bodyId = `${id}-body`;

  return (
    <>
      <h2 id={headingId}>
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
          data-accordion-target={`#${bodyId}`}
          aria-expanded={initiallyOpen}
          aria-controls={bodyId}
        >
          <span className={titleClassName}>{title}</span>
          <ArrowDown />
        </button>
      </h2>
      <div id={bodyId} className="hidden" aria-labelledby={headingId}>
        {children}
      </div>
    </>
  );
};

export { Accordion, AccordionWrapper };
