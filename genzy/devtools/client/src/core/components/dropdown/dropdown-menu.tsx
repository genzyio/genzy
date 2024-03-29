import { type FC, type PropsWithChildren, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../../utils/class-names";

export type DropDownMenuProps = PropsWithChildren & {
  icon: React.ElementType;
  size?: "small" | "normal" | "large";
  direction?: "top" | "bottom";
};

const sizeClassMap: Record<DropDownMenuProps["size"], string> = {
  small: "w-40",
  normal: "w-48",
  large: "w-60",
};

export const DropDownMenu: FC<DropDownMenuProps> = ({
  icon: Icon,
  size = "normal",
  direction = "bottom",
  children,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          <Icon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            `absolute right-0 z-10 mt-2 ${sizeClassMap[size]} origin-top-right rounded-md bg-brand-node-dark shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border-[1px] border-gray-500`,
            direction === "top" ? "bottom-full" : ""
          )}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
