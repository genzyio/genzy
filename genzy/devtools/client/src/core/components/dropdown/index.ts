import { type DropDownMenuProps, DropDownMenu } from "./dropdown-menu";
import { DropdownItemHandler } from "./dropdown-item-handler";
import { DropdownItemLink } from "./dropdown-item-link";

const DropDown = {
  Menu: DropDownMenu,
  LinkItem: DropdownItemLink,
  HandlerItem: DropdownItemHandler,
};

export { DropDown };

export type { DropDownMenuProps };
