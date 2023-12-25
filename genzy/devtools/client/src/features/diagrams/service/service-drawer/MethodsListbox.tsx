import { type FC } from "react";
import {
  Listbox,
  type ListboxProps,
  type ListboxTemplateProps,
} from "../../../../core/components/listbox";
import { HTTP_METHOD } from "../models";

const colors = {
  GET: "bg-blue-400",
  POST: "bg-green-400",
  PUT: "bg-orange-400",
  DELETE: "bg-red-400",
} as const;

type MethodData = {
  id: string;
  method: string;
  color: string;
};

const methods: MethodData[] = Object.keys(HTTP_METHOD).map((httpMethod) => ({
  id: httpMethod,
  method: httpMethod,
  color: colors[httpMethod],
}));

const MethodOptionTemplate: FC<ListboxTemplateProps<MethodData>> = ({ data }) => {
  const { color, method } = data;

  return (
    <div className="pl-1.5 py-0.5 w-[4.5em]">
      <span className={`${color} rounded-md p-1 text-white font-bold text-xs text-center block`}>
        {method}
      </span>
    </div>
  );
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
