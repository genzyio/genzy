import { type FC, type PropsWithChildren } from "react";
import { Menu } from "@headlessui/react";
import { classNames } from "../../utils/class-names";

type DropdownItemLinkProps = PropsWithChildren & {
  href: string;
};

export const DropdownItemLink: FC<DropdownItemLinkProps> = ({ href, children }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          className={classNames(
            "font-medium text-gray-300",
            active ? "bg-gray-500" : "",
            "block px-4 py-2 text-sm"
          )}
        >
          {children}
        </a>
      )}
    </Menu.Item>
  );
};
