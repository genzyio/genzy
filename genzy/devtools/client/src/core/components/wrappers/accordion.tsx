import { type FC, type PropsWithChildren } from "react";
import { ArrowDown, ArrowUp } from "../../icons/arrows";
import { Disclosure, Transition } from "@headlessui/react";

type AccordionProps = PropsWithChildren & {
  title: string;
  titleClassName?: string;
  className?: string;
  initiallyOpen?: boolean;
};

export const Accordion: FC<AccordionProps> = ({
  title,
  titleClassName = "font-medium text-left text-gray-400",
  className = "",
  initiallyOpen = false,
  children,
}) => {
  return (
    <div className={className}>
      <Disclosure defaultOpen={initiallyOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full flex items-center justify-between pb-3">
              <span className={titleClassName}>{title}</span>

              <div className={titleClassName}>{open ? <ArrowUp /> : <ArrowDown />}</div>
            </Disclosure.Button>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel className="w-full">{children}</Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
