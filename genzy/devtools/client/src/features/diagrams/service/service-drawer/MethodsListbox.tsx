import { type FC } from "react";
import {
  Listbox,
  type ListboxProps,
  type ListboxTemplateProps,
} from "../../../../core/components/listbox";
import { HTTP_METHOD } from "../models";

const colors = {
  GET: { default: "bg-blue-400", active: "bg-blue-300" },
  POST: { default: "bg-green-400", active: "bg-green-300" },
  PUT: { default: "bg-orange-400", active: "bg-orange-300" },
  DELETE: { default: "bg-red-400", active: "bg-red-500" },
} as const;

type MethodData = {
  id: string;
  method: string;
  styles: {
    bgColor: string;
    bgColorActive: string;
  };
};

const methods: MethodData[] = Object.keys(HTTP_METHOD).map((httpMethod) => ({
  id: httpMethod,
  method: httpMethod,
  styles: {
    bgColor: colors[httpMethod].default,
    bgColorActive: colors[httpMethod].active,
  },
}));

const MethodOptionTemplate: FC<ListboxTemplateProps<MethodData>> = ({ selected = false, data }) => {
  const { method } = data;

  return <div className={`rounded-md p-1 pl-3 text-start text-gray-100`}>{method}</div>;
};

type MethodsListboxProps = {
  label?: string;
  className?: string;
} & Pick<ListboxProps, "value" | "disabled" | "onChange">;

export const MethodListitem: FC<MethodsListboxProps> = ({
  label = "Method",
  value,
  disabled,
  onChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <Listbox
        label={label}
        disabled={disabled}
        value={value}
        options={methods.map((method) => ({ value: method.id, data: method }))}
        template={MethodOptionTemplate}
        onChange={onChange}
      />
    </div>
  );
};
