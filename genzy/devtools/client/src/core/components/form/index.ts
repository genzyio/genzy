import { Checkbox } from "./checkbox";
import { Listbox, type ListboxProps, type ListboxTemplateProps } from "./listbox";
import { Select } from "./select";
import { TextField } from "./text-field";

const Form = {
  TextField: TextField,
  SelectOption: Select,
  Checkbox,
  Listbox,
};

export { Form };

export type { ListboxProps, ListboxTemplateProps };
