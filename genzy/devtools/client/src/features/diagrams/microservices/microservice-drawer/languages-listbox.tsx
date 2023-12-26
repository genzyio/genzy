import { type FC } from "react";
import { type ListboxProps, type ListboxTemplateProps, Form } from "@core/components/form";
import { classNames } from "@core/utils/class-names";
import { LanguageIcons } from "../constants";

type LanguageData = {
  id: string;
  name: string;
  logo: string;
};

const languages: LanguageData[] = [
  {
    id: "js",
    name: "Javascript",
    logo: LanguageIcons["js"],
  },
  {
    id: "ts",
    name: "Typescipt",
    logo: LanguageIcons["ts"],
  },
];

const LanguageOptionTemplate: FC<ListboxTemplateProps<LanguageData>> = ({
  selected = false,
  data,
}) => {
  const { name, logo } = data;

  return (
    <>
      <div className="flex space-x-2 items-center py-1.5 pl-3">
        <img src={logo} className="flex-shrink-0" height={16} width={16} alt="" />
        <span className={classNames(selected ? "font-medium" : "font-normal", "block truncate")}>
          {name}
        </span>
      </div>
    </>
  );
};

type LanguagesListboxProps = {
  label?: string;
  className?: string;
} & Pick<ListboxProps, "value" | "disabled" | "onChange">;

export const LanguagesListitem: FC<LanguagesListboxProps> = ({
  label = "Language",
  value,
  disabled,
  onChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <Form.Listbox
        label={label}
        disabled={disabled}
        value={value}
        options={languages.map((language) => ({ value: language.id, data: language }))}
        template={LanguageOptionTemplate}
        onChange={onChange}
      />
    </div>
  );
};
