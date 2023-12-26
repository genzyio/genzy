import { type FC, type PropsWithChildren } from "react";
import { Menu } from "@headlessui/react";
import { classNames } from "../../utils/class-names";

type DropdownItemHandlerProps = PropsWithChildren & {
  onClick: () => any;
};

export const DropdownItemHandler: FC<DropdownItemHandlerProps> = ({ onClick, children }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <p
          onClick={onClick}
          className={classNames(
            "font-medium text-gray-300 cursor-pointer",
            active ? "bg-gray-500" : "",
            "block px-4 py-2 text-sm"
          )}
        >
          {children}
        </p>
      )}
    </Menu.Item>
  );
};
